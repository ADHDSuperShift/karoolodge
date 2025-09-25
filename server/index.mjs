import express from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  AWS_REGION,
  AWS_S3_BUCKET,
  UPLOAD_API_KEY,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID
} = process.env;

if (!AWS_REGION || !AWS_S3_BUCKET) {
  throw new Error('Missing AWS configuration. Ensure AWS_REGION and AWS_S3_BUCKET are set.');
}

if (!UPLOAD_API_KEY) {
  throw new Error('Missing upload API key. Set UPLOAD_API_KEY in your environment.');
}

if (!COGNITO_REGION || !COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
  throw new Error('Missing Cognito configuration. Set COGNITO_REGION, COGNITO_USER_POOL_ID, and COGNITO_CLIENT_ID.');
}

const s3Client = new S3Client({ region: AWS_REGION });

const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: COGNITO_CLIENT_ID
});

const jwksUrl = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const warmCognitoJwksCache = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(jwksUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`JWKS request failed with status ${response.status}`);
    }

    const jwks = await response.json();
    cognitoVerifier.cacheJwks(jwks);
    console.log('Cognito JWKS cache preloaded');
  } catch (error) {
    console.warn('Unable to preload Cognito JWKS cache', error);
  }
};

await warmCognitoJwksCache();

app.post('/api/auth/api-key', async (req, res) => {
  try {
    const { idToken } = req.body ?? {};

    if (typeof idToken !== 'string' || !idToken.length) {
      return res.status(400).json({ message: 'idToken is required.' });
    }

    let payload;

    try {
      payload = await cognitoVerifier.verify(idToken, {
        clientId: COGNITO_CLIENT_ID
      });
    } catch (verifyError) {
      console.warn('Primary Cognito verification failed, refreshing JWKS...', verifyError);
      await warmCognitoJwksCache();
      payload = await cognitoVerifier.verify(idToken, {
        clientId: COGNITO_CLIENT_ID
      });
    }

    res.json({
      apiKey: UPLOAD_API_KEY,
      user: {
        sub: payload.sub,
        email: payload.email,
        name: payload.name
      }
    });
  } catch (error) {
    console.error('Failed to verify Cognito token', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/upload-url', async (req, res) => {
  try {
    const providedKey = req.header('x-api-key');
    if (providedKey !== UPLOAD_API_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fileName, fileType, folder = 'uploads' } = req.body ?? {};

    if (!fileName || !fileType) {
      return res.status(400).json({ message: 'fileName and fileType are required.' });
    }

    const safeFolder = folder.replace(/^\/+|\/+$|\.{2,}/g, '') || 'uploads';
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = `${safeFolder}/${Date.now()}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: objectKey,
      ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const publicUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;

    res.json({ uploadUrl, publicUrl, key: objectKey });
  } catch (error) {
    console.error('Failed to create pre-signed URL', error);
    res.status(500).json({ message: 'Could not create upload URL' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Upload server ready at http://localhost:${PORT}`);
});
