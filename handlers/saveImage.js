const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const corsHeaders = require('./corsHeaders');

const dynamoClient = new DynamoDBClient({ region: process.env.S3_REGION || 'eu-west-1' });

exports.saveImage = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: require('./baseHeaders'),
      body: '',
    };
  }

  try {
    const { fileUrl, folder } = JSON.parse(event.body || '{}');

    if (!fileUrl) {
      return {
        statusCode: 400,
  headers: { ...require('./baseHeaders'), 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'fileUrl is required' }),
      };
    }

    await dynamoClient.send(
      new PutItemCommand({
        TableName: process.env.DYNAMO_TABLE || 'MediaFiles',
        Item: {
          fileUrl: { S: fileUrl },
          folder: { S: folder || 'backgrounds' },
          createdAt: { S: new Date().toISOString() },
        },
      })
    );

    return {
      statusCode: 200,
  headers: { ...require('./baseHeaders'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('saveImage error:', err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
