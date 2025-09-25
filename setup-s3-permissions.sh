#!/bin/bash

echo "================================================"
echo "S3 BUCKET PERMISSIONS SETUP FOR CLOUDFRONT"
echo "================================================"
echo ""

BUCKET_NAME="barrydale-media"
CLOUDFRONT_DOMAIN="d3ieyce90rkgk7.cloudfront.net"

echo "🎯 Setting up permissions for:"
echo "   • S3 Bucket: $BUCKET_NAME"
echo "   • CloudFront: $CLOUDFRONT_DOMAIN"
echo ""

echo "📋 STEP 1: Get your CloudFront Distribution ID"
echo "----------------------------------------"
echo "Go to AWS Console → CloudFront → Find distribution for $CLOUDFRONT_DOMAIN"
echo "Copy the Distribution ID (looks like: E1234567890ABC)"
echo ""

echo "📋 STEP 2: Get your AWS Account ID"  
echo "------------------------------"
echo "Go to AWS Console → Top right → Your account → Copy Account ID"
echo ""

echo "📋 STEP 3: Apply S3 Bucket Policy"
echo "------------------------------"
echo "Go to S3 Console → $BUCKET_NAME → Permissions → Bucket Policy"
echo "Replace the policy with:"
echo ""
echo '{'
echo '  "Version": "2012-10-17",'
echo '  "Statement": ['
echo '    {'
echo '      "Sid": "AllowCloudFrontAccess",'
echo '      "Effect": "Allow",'
echo '      "Principal": {'
echo '        "Service": "cloudfront.amazonaws.com"'
echo '      },'
echo '      "Action": "s3:GetObject",'
echo '      "Resource": "arn:aws:s3:::barrydale-media/*",'
echo '      "Condition": {'
echo '        "StringEquals": {'
echo '          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"'
echo '        }'
echo '      }'
echo '    }'
echo '  ]'
echo '}'
echo ""
echo "⚠️  IMPORTANT: Replace YOUR_ACCOUNT_ID and YOUR_DISTRIBUTION_ID with actual values!"
echo ""

echo "📋 STEP 4: Test Upload"
echo "------------------"
echo "1. Go to your admin console"
echo "2. Try uploading an image"  
echo "3. Check browser console for: ✅ Upload successful!"
echo "4. Image should display without 403 errors"
echo ""

echo "🔧 ALTERNATIVE: Quick Test Policy (Less Secure)"
echo "==============================================" 
echo "For immediate testing, you can use this simpler policy:"
echo ""
echo '{'
echo '  "Version": "2012-10-17",'
echo '  "Statement": ['
echo '    {'
echo '      "Sid": "PublicReadGetObject",'
echo '      "Effect": "Allow",'
echo '      "Principal": "*",'
echo '      "Action": "s3:GetObject",'
echo '      "Resource": "arn:aws:s3:::barrydale-media/*"'
echo '    }'
echo '  ]'
echo '}'
echo ""
echo "⚠️  This makes files publicly readable - use only for testing!"
echo ""
echo "================================================"
