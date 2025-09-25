const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const REGION = process.env.S3_REGION || 'eu-west-1';
const S3_BUCKET = process.env.S3_BUCKET || 'barrydale-media';
const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'MediaFiles';

const s3Client = new S3Client({ region: REGION });
const dynamoClient = new DynamoDBClient({ region: REGION });

const baseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-API-Key',
};

exports.getUploadUrl = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: baseHeaders,
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { filename, contentType, folder } = body;

    if (!filename) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({ error: 'Filename is required' }),
      };
    }

    const providedApiKey = event.headers['x-api-key'] || event.headers['X-API-Key'];
    if (!process.env.UPLOAD_API_KEY || providedApiKey !== process.env.UPLOAD_API_KEY) {
      return {
        statusCode: 401,
        headers: baseHeaders,
        body: JSON.stringify({ error: 'Invalid API key' }),
      };
    }

    const folderPrefix = folder ? `${folder}/` : '';
    const uniqueName = `${Date.now()}_${filename}`;
    const key = `${folderPrefix}${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType || 'image/jpeg',
    });
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const cloudfrontDomain = (process.env.CLOUDFRONT_URL || '').replace(/\/$/, '');
    if (!cloudfrontDomain) {
      throw new Error('CLOUDFRONT_URL is not set in environment variables');
    }
    const fileUrl = `${cloudfrontDomain}/${key}`;

    const id = uuidv4();
    const uploadedAt = Date.now();

    await dynamoClient.send(
      new PutItemCommand({
        TableName: DYNAMO_TABLE,
        Item: {
          id: { S: id },
          url: { S: fileUrl },
          folder: { S: folder || 'default' },
          uploadedAt: { N: uploadedAt.toString() },
        },
      })
    );

    return {
      statusCode: 200,
      headers: { ...baseHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadURL,
        fileUrl,
        key,
        id,
        uploadedAt,
      }),
    };
  } catch (error) {
    console.error('Error in getUploadUrl:', error);
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
