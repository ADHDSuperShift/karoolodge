const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// Get settings
exports.get = async (event) => {
  console.log('Settings get called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const result = await dynamodb.scan({
      TableName: process.env.SETTINGS_TABLE
    }).promise();

    // Convert array to object for easier frontend consumption
    const settings = {};
    result.Items.forEach(item => {
      settings[item.key] = item.value;
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(settings)
    };
  } catch (error) {
    console.error('Settings get error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to fetch settings' })
    };
  }
};

// Update settings (batch update)
exports.update = async (event) => {
  console.log('Settings update called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const settings = JSON.parse(event.body || '{}');

    if (typeof settings !== 'object' || Array.isArray(settings)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Settings data must be an object' })
      };
    }

    // Convert object to array of key-value pairs for DynamoDB
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return dynamodb.put({
        TableName: process.env.SETTINGS_TABLE,
        Item: {
          key,
          value,
          updatedAt: new Date().toISOString()
        }
      }).promise();
    });

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Settings updated successfully',
        count: Object.keys(settings).length 
      })
    };
  } catch (error) {
    console.error('Settings update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to update settings' })
    };
  }
};
