const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// List all wines
exports.list = async (event) => {
  console.log('Wines list called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const category = event.queryStringParameters?.category;
    let params = {
      TableName: process.env.WINES_TABLE
    };

    // If category filter is specified
    if (category && category !== 'all') {
      params = {
        ...params,
        IndexName: 'CategoryIndex',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category
        }
      };
      
      const result = await dynamodb.query(params).promise();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Items || [])
      };
    } else {
      const result = await dynamodb.scan(params).promise();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Items || [])
      };
    }
  } catch (error) {
    console.error('Wines list error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to fetch wines' })
    };
  }
};

// Update wines (batch update)
exports.update = async (event) => {
  console.log('Wines update called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const wines = JSON.parse(event.body || '[]');

    if (!Array.isArray(wines)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Wines data must be an array' })
      };
    }

    const updatePromises = wines.map(wine => {
      const wineData = {
        ...wine,
        updatedAt: new Date().toISOString()
      };

      return dynamodb.put({
        TableName: process.env.WINES_TABLE,
        Item: wineData
      }).promise();
    });

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Wines updated successfully',
        count: wines.length 
      })
    };
  } catch (error) {
    console.error('Wines update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to update wines' })
    };
  }
};
