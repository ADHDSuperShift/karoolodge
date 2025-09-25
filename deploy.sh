#!/bin/bash

echo "🚀 Deploying Karoo Lodge to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "📦 Installing Serverless Framework..."
    npm install -g serverless
fi

# Deploy backend API
echo "🔧 Deploying backend API..."
cp backend-package.json package.json
npm install
serverless deploy

# Get the API Gateway URL from the deployment output
API_URL=$(serverless info --verbose | grep -o 'https://[^/]*\.amazonaws\.com/[^/]*' | head -1)

if [ -z "$API_URL" ]; then
    echo "❌ Could not get API URL from serverless deployment"
    exit 1
fi

echo "✅ Backend deployed to: $API_URL"

# Update environment variables with the real API URL
sed -i.bak "s|VITE_AUTH_ENDPOINT=.*|VITE_AUTH_ENDPOINT=${API_URL}/api/get-api-key|g" .env
sed -i.bak "s|VITE_UPLOAD_ENDPOINT=.*|VITE_UPLOAD_ENDPOINT=${API_URL}/api/upload-url|g" .env

# Remove the hardcoded endpoint from AuthContext
sed -i.bak "s|'http://localhost:4001/api/get-api-key'|\`\${import.meta.env.VITE_AUTH_ENDPOINT}\`|g" src/contexts/AuthContext.tsx

echo "✅ Environment variables updated"

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

echo "📋 Next steps:"
echo "1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "2. Click 'Host web app'"
echo "3. Choose 'Deploy without Git provider'"
echo "4. Drag and drop the 'dist' folder"
echo "5. Or connect your GitHub repo for continuous deployment"
echo ""
echo "Your API endpoints:"
echo "Auth: ${API_URL}/api/get-api-key"
echo "Upload: ${API_URL}/api/upload-url"
