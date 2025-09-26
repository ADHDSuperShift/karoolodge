#!/bin/bash

echo "🔍 CLOUDFRONT DISTRIBUTION CHECKER & CREATOR"
echo "============================================="
echo ""

# Check if AWS CLI is configured
echo "1. Checking AWS Configuration..."
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not installed"
    exit 1
fi

echo "✅ AWS CLI found"
echo "Current AWS Configuration:"
aws configure list 2>/dev/null || echo "⚠️  AWS CLI not configured"
echo ""

# Check for existing distributions
echo "2. Searching for CloudFront Distributions..."
echo ""

# Try to list all distributions
DISTRIBUTIONS=$(aws cloudfront list-distributions --query 'DistributionList.Items[]' --output json 2>/dev/null)

if [ "$DISTRIBUTIONS" = "[]" ] || [ "$DISTRIBUTIONS" = "null" ] || [ -z "$DISTRIBUTIONS" ]; then
    echo "❌ No CloudFront distributions found in your account"
    echo ""
    echo "🚀 OPTION 1: Create New Distribution"
    echo "====================================="
    echo ""
    echo "Since no distribution exists, you have two options:"
    echo ""
    echo "A) Create CloudFront Distribution (AWS Console):"
    echo "   1. Go to AWS Console → CloudFront"
    echo "   2. Click 'Create Distribution'"
    echo "   3. Origin Domain: barrydale-media.s3.eu-west-1.amazonaws.com"
    echo "   4. Origin Path: (leave empty)"
    echo "   5. Viewer Protocol Policy: Redirect HTTP to HTTPS"
    echo "   6. Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
    echo "   7. Cache Policy: Caching Optimized"
    echo "   8. Origin Request Policy: CORS-S3Origin"
    echo "   9. Click 'Create Distribution'"
    echo "   10. Wait 10-15 minutes for deployment"
    echo "   11. Copy the new domain name (e.g., d1234567890abc.cloudfront.net)"
    echo ""
    echo "B) Use S3 Direct URLs (Temporary Solution):"
    echo "   1. Set bucket to public read"
    echo "   2. Use S3 URLs: https://barrydale-media.s3.eu-west-1.amazonaws.com/..."
    echo ""
else
    echo "✅ Found CloudFront distributions:"
    echo "$DISTRIBUTIONS" | jq -r '.[] | "ID: \(.Id), Domain: \(.DomainName), Status: \(.Status)"' 2>/dev/null || echo "$DISTRIBUTIONS"
    echo ""
    
    # Check if the specific domain exists
  SPECIFIC_DIST=$(echo "$DISTRIBUTIONS" | jq -r '.[] | select(.DomainName == "d3ieyce90rkgk7.cloudfront.net")' 2>/dev/null)
    
    if [ -n "$SPECIFIC_DIST" ] && [ "$SPECIFIC_DIST" != "null" ]; then
  echo "✅ Found your distribution: d3ieyce90rkgk7.cloudfront.net"
        DIST_ID=$(echo "$SPECIFIC_DIST" | jq -r '.Id' 2>/dev/null)
        echo "Distribution ID: $DIST_ID"
        echo ""
        echo "🔧 Apply this S3 bucket policy in AWS Console:"
        echo "S3 → barrydale-media → Permissions → Bucket Policy"
        echo ""
        cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::barrydale-media/*"
    }
  ]
}
EOF
        echo ""
    else
  echo "⚠️  Your specific distribution (d3ieyce90rkgk7.cloudfront.net) not found"
        echo "But other distributions exist. You can either:"
        echo "1. Use one of the existing distributions above"
        echo "2. Create a new distribution"
        echo "3. Update your code to use an existing domain"
    fi
fi

echo ""
echo "🚀 OPTION 2: Use Direct S3 URLs (Quick Fix)"
echo "==========================================="
echo ""
echo "For immediate testing, you can bypass CloudFront:"
echo "1. Go to S3 Console → barrydale-media → Permissions"
echo "2. Turn OFF 'Block all public access'"
echo "3. Apply this bucket policy:"
echo ""
cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::barrydale-media/*"
    }
  ]
}
EOF
echo ""
echo "4. Update your code to use S3 URLs temporarily:"
echo "   https://barrydale-media.s3.eu-west-1.amazonaws.com/..."
echo ""
echo "This will work immediately while you set up CloudFront!"
echo ""
echo "============================================="
