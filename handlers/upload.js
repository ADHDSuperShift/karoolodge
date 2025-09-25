const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const baseHeaders = require('./baseHeaders');

const s3Client = new S3Client({ region: process.env.S3_REGION || 'eu-west-1' });

exports.getUploadUrl = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: baseHeaders, body: '' };
  }

  try {
    const { filename, contentType, folder } = JSON.parse(event.body || '{}');
    if (!filename) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({ error: 'Filename is required' }),
      };
    }

    const key = folder ? `${folder}/${filename}` : filename;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || 'barrydale-media',
      Key: key,
      ContentType: contentType || 'image/jpeg',
    });

    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const cloudfrontBase = process.env.CLOUDFRONT_URL || '';
    const normalizedBase = cloudfrontBase.startsWith('http')
      ? cloudfrontBase.replace(/\/$/, '')
      : `https://${cloudfrontBase.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
    const fileUrl = `${normalizedBase}/${key}`;

    return {
      statusCode: 200,
      headers: { ...baseHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadURL, fileUrl, key }),
    };
  } catch (err) {
    console.error('getUploadUrl error:', err);
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
