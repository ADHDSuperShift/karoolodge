const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

exports.getSignedUrl = async (event) => {
  console.log('Upload signed URL request:', event.body);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { fileName, fileType, folder } = data;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'fileName and fileType are required' })
      };
    }

    // Sanitize filename and add unique identifier
    const timestamp = Date.now();
    const uniqueId = uuidv4().substring(0, 8);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalFileName = `${timestamp}_${uniqueId}_${sanitizedFileName}`;
    
    // Construct S3 key with optional folder
    const folderPath = folder ? `${folder}/` : '';
    const s3Key = `${folderPath}${finalFileName}`;

    // Generate presigned URL for PUT operation
    const uploadParams = {
      Bucket: process.env.MEDIA_BUCKET,
      Key: s3Key,
      ContentType: fileType,
      Expires: 300, // 5 minutes
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', uploadParams);

    // Construct the public URL using CloudFront
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
    const publicUrl = `https://${cloudFrontDomain}/${s3Key}`;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        uploadUrl,
        publicUrl,
        key: s3Key,
        fileName: finalFileName,
        expiresIn: 300
      })
    };
  } catch (error) {
    console.error('Upload signed URL error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to generate upload URL',
        message: error.message 
      })
    };
  }
};
