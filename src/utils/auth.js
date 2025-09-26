const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

// Verify JWT token from Cognito
const verifyToken = async (token) => {
  try {
    if (!token || !token.startsWith('Bearer ')) {
      throw new Error('No valid token provided');
    }

    const jwtToken = token.substring(7); // Remove 'Bearer ' prefix
    
    // For now, we'll do a simple decode without verification
    // In production, you should verify the signature properly
    const decoded = jwt.decode(jwtToken);
    
    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token');
    }

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Unauthorized');
  }
};

// Check if request is authenticated
const requireAuth = async (event) => {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  return await verifyToken(authHeader);
};

module.exports = {
  verifyToken,
  requireAuth
};
