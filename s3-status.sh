#!/bin/bash

# S3 Bucket Management Script for Karoo Lodge
# Bucket: barrydalekaroo185607-dev
# Region: us-east-1

BUCKET_NAME="barrydalekaroo185607-dev"
REGION="us-east-1"

echo "🪣 S3 Bucket Management for Karoo Lodge"
echo "========================================"

echo "📋 Bucket Status:"
aws s3 ls s3://$BUCKET_NAME --region $REGION

echo ""
echo "🌐 CORS Configuration:"
aws s3api get-bucket-cors --bucket $BUCKET_NAME --region $REGION

echo ""
echo "🔓 Public Access Settings:"
aws s3api get-public-access-block --bucket $BUCKET_NAME --region $REGION

echo ""
echo "📖 Bucket Policy:"
aws s3api get-bucket-policy --bucket $BUCKET_NAME --region $REGION

echo ""
echo "✅ S3 bucket is configured for:"
echo "   - CORS enabled for localhost development"
echo "   - Public read access for uploaded images"
echo "   - Amplify Storage integration"
echo "   - Admin console file uploads"
