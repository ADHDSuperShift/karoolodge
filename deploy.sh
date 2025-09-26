#!/bin/bash

# Karoo Lodge Backend Deployment Script

echo "🦘 Deploying Karoo Lodge Backend to AWS (us-east-1)"
echo "================================================="

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not found. Installing..."
    npm install -g serverless
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to AWS
echo "🚀 Deploying to AWS..."
serverless deploy --region us-east-1

# Get deployed endpoints
echo "📋 Deployment completed! Your endpoints:"
serverless info --region us-east-1

echo ""
echo "🔐 Remember to:"
echo "1. Create an admin user in your Cognito User Pool"
echo "2. Update your frontend environment variables with the deployed endpoints"
echo "3. Test your authentication endpoint"
echo ""
echo "Happy coding! 🦘"
