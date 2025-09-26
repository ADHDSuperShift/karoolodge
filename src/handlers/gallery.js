const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// List all gallery images
exports.list = async (event) => {
  console.log('Gallery list called');

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
      TableName: process.env.GALLERY_TABLE
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
    console.error('Gallery list error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to fetch gallery images' })
    };
  }
};

// Create new gallery image
exports.create = async (event) => {
  console.log('Gallery create called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { src, title, description, category } = data;

    if (!src || !title || !category) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: src, title, category' })
      };
    }

    const galleryItem = {
      id: uuidv4(),
      src,
      title,
      description: description || '',
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: process.env.GALLERY_TABLE,
      Item: galleryItem
    }).promise();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(galleryItem)
    };
  } catch (error) {
    console.error('Gallery create error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to create gallery image' })
    };
  }
};

// Update gallery image
exports.update = async (event) => {
  console.log('Gallery update called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const id = event.pathParameters?.id;
    const data = JSON.parse(event.body || '{}');

    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing image ID' })
      };
    }

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (data.src) {
      updateExpression.push('#src = :src');
      expressionAttributeNames['#src'] = 'src';
      expressionAttributeValues[':src'] = data.src;
    }

    if (data.title) {
      updateExpression.push('#title = :title');
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = data.title;
    }

    if (data.description !== undefined) {
      updateExpression.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = data.description;
    }

    if (data.category) {
      updateExpression.push('#category = :category');
      expressionAttributeNames['#category'] = 'category';
      expressionAttributeValues[':category'] = data.category;
    }

    if (updateExpression.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No fields to update' })
      };
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: process.env.GALLERY_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Gallery update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to update gallery image' })
    };
  }
};

// Delete gallery image
exports.remove = async (event) => {
  console.log('Gallery delete called');

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing image ID' })
      };
    }

    await dynamodb.delete({
      TableName: process.env.GALLERY_TABLE,
      Key: { id }
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Gallery image deleted successfully' })
    };
  } catch (error) {
    console.error('Gallery delete error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to delete gallery image' })
    };
  }
};
