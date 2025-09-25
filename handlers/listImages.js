const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const baseHeaders = require("./baseHeaders");

const dynamoClient = new DynamoDBClient({ region: process.env.S3_REGION || "eu-west-1" });

exports.listImages = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: baseHeaders, body: "" };
  }

  try {
    const result = await dynamoClient.send(
      new ScanCommand({ TableName: process.env.DYNAMO_TABLE || "MediaFiles" })
    );

    const items = result.Items.map((item) => ({
      fileUrl: item.fileUrl.S,
      folder: item.folder?.S || "backgrounds",
      createdAt: item.createdAt?.S || null
    }));

    return {
      statusCode: 200,
      headers: { ...baseHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    };
  } catch (err) {
    console.error("Error in listImages:", err);
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
