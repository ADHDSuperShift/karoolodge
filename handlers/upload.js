const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.S3_REGION || 'eu-west-1' });

exports.getUploadUrl = async (event) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
            },
            body: ''
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { filename, contentType, folder } = body;

        if (!filename) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
                },
                body: JSON.stringify({ error: 'Filename is required' })
            };
        }

        // Validate API key
        const providedApiKey = event.headers['x-api-key'] || event.headers['X-API-Key'];
        const validApiKey = process.env.UPLOAD_API_KEY || '79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159';
        
        if (providedApiKey !== validApiKey) {
            return {
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
                },
                body: JSON.stringify({ error: 'Invalid API key' })
            };
        }

        // Generate presigned URL for S3 upload
        const bucketName = process.env.S3_BUCKET || 'barrydale-media';
        // Construct the S3 key with folder support
        const key = folder ? `${folder}/${filename}` : filename;
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType || 'image/jpeg'
            // Removed ACL: 'public-read' as it may be blocked by bucket policy
        });

        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        const region = process.env.S3_REGION || 'eu-west-1';
        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uploadURL,
                fileUrl,
                key
            })
        };
    } catch (error) {
        console.error('Error in getUploadUrl:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
