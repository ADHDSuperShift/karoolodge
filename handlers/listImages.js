const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
};

const dynamoClient = new DynamoDBClient({ region: process.env.S3_REGION || 'eu-west-1' });

exports.listImages = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: require('./baseHeaders'), body: '' };
  }

  try {
    const result = await dynamoClient.send(
      new ScanCommand({ TableName: process.env.DYNAMO_TABLE || 'MediaFiles' })
    );

    const items = (result.Items || []).map((item) => ({
      fileUrl: item.fileUrl.S,
      folder: item.folder?.S || 'backgrounds',
      createdAt: item.createdAt?.S || null,
    }));

    return {
      statusCode: 200,
  headers: { ...require('./baseHeaders'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    console.error('listImages error:', err);
    return {
      statusCode: 500,
  headers: require('./baseHeaders'),
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
