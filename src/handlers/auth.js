const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Auth handler called:', event.path, event.httpMethod);

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const path = event.path;
    
    if (path === '/auth/login' && event.httpMethod === 'POST') {
      return await handleLogin(event);
    } else if (path === '/auth/refresh' && event.httpMethod === 'POST') {
      return await handleRefresh(event);
    }
    
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

async function handleLogin(event) {
  const { username, password } = JSON.parse(event.body || '{}');

  if (!username || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Username and password are required' })
    };
  }

  try {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      }
    };

    console.log('Attempting Cognito authentication for:', username);
    const result = await cognito.initiateAuth(params).promise();

    const authResult = result.AuthenticationResult;
    
    if (!authResult) {
      throw new Error('Authentication failed - no result returned');
    }

    // Decode the ID token to get user info
    const idTokenPayload = jwt.decode(authResult.IdToken);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
        refreshToken: authResult.RefreshToken,
        expiresIn: authResult.ExpiresIn,
        user: {
          id: idTokenPayload.sub,
          username: idTokenPayload.preferred_username || idTokenPayload['cognito:username'],
          email: idTokenPayload.email
        }
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Authentication failed';
    let statusCode = 401;
    
    if (error.code === 'NotAuthorizedException') {
      errorMessage = 'Invalid username or password';
    } else if (error.code === 'UserNotFoundException') {
      errorMessage = 'User not found';
    } else if (error.code === 'UserNotConfirmedException') {
      errorMessage = 'User account not confirmed';
    } else if (error.code === 'TooManyRequestsException') {
      errorMessage = 'Too many requests. Please try again later.';
      statusCode = 429;
    }

    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
}

async function handleRefresh(event) {
  const { refreshToken } = JSON.parse(event.body || '{}');

  if (!refreshToken) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Refresh token is required' })
    };
  }

  try {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.USER_POOL_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      }
    };

    const result = await cognito.initiateAuth(params).promise();
    const authResult = result.AuthenticationResult;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
        expiresIn: authResult.ExpiresIn
      })
    };
  } catch (error) {
    console.error('Refresh error:', error);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid refresh token' })
    };
  }
}
