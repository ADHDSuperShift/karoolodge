const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// List all rooms
exports.list = async (event) => {
  console.log('Rooms list called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const result = await dynamodb.scan({
      TableName: process.env.ROOMS_TABLE
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Rooms list error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to fetch rooms' })
    };
  }
};

// Update rooms (batch update)
exports.update = async (event) => {
  console.log('Rooms update called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const rooms = JSON.parse(event.body || '[]');

    if (!Array.isArray(rooms)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Rooms data must be an array' })
      };
    }

    const updatePromises = rooms.map(room => {
      const roomData = {
        ...room,
        updatedAt: new Date().toISOString()
      };

      return dynamodb.put({
        TableName: process.env.ROOMS_TABLE,
        Item: roomData
      }).promise();
    });

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Rooms updated successfully',
        count: rooms.length 
      })
    };
  } catch (error) {
    console.error('Rooms update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to update rooms' })
    };
  }
};
