import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());

// Mock API key for demonstration
const MOCK_API_KEY = 'test-api-key-' + Date.now();

app.post('/api/get-api-key', (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    // In a real implementation, you would verify the JWT token with AWS Cognito
    // For now, we'll just decode it without verification for testing
    const decoded = jwt.decode(idToken);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return a mock API key
    res.json({ 
      apiKey: MOCK_API_KEY,
      userId: decoded.sub || 'test-user'
    });
  } catch (error) {
    console.error('Error processing token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock upload URL endpoint
app.post('/api/upload-url', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { fileName, fileType, folder } = req.body;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  if (apiKey !== MOCK_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'fileName and fileType are required' });
  }

  // For testing purposes, return mock URLs
  // In a real implementation, you would generate presigned S3 URLs
  const mockUploadUrl = `https://example-bucket.s3.amazonaws.com/${folder || 'uploads'}/${fileName}?mock=true`;
  const mockPublicUrl = `https://d3ieyce90rkgk7.cloudfront.net/${folder || 'uploads'}/${fileName}`;

  res.json({
    uploadUrl: mockUploadUrl,
    publicUrl: mockPublicUrl
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
