import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET ?? process.env.S3_BUCKET;
const uploadApiKey = process.env.UPLOAD_API_KEY;

if (!region || !bucket) {
  throw new Error('Missing AWS configuration. Ensure AWS_REGION and AWS_S3_BUCKET (or S3_BUCKET) are set.');
}

if (!uploadApiKey) {
  throw new Error('Missing upload API key. Set UPLOAD_API_KEY in your environment.');
}

const s3Client = new S3Client({ region });

export const handler = async (event) => {
  try {
    const headers = event.headers ?? {};
    const providedKey =
      headers['x-api-key'] ?? headers['X-Api-Key'] ?? headers['X-API-KEY'];

    if (providedKey !== uploadApiKey) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Unauthorized" })
      };
    }

    const body = JSON.parse(event.body ?? "{}");
    const { fileName, fileType, folder = "uploads" } = body;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "fileName and fileType required." }),
      };
    }

    const safeFolder = folder.replace(/^\/+|\/+$|\.{2,}/g, "") || "uploads";
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${safeFolder}/${Date.now()}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ uploadUrl, publicUrl, key }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to create upload URL" }),
    };
  }
};
