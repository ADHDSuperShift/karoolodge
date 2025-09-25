#!/bin/bash

echo "🔧 S3 CORS and Upload Test Script"
echo "================================="

# Test 1: Check if CORS policy is applied
echo "1. Checking S3 CORS policy..."
aws s3api get-bucket-cors --bucket barrydale-media

echo ""
echo "2. Testing upload URL generation..."
# Test 2: Test upload URL generation
curl -X POST https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159" \
  -d '{"filename": "test-cors.jpg", "contentType": "image/jpeg"}'

echo ""
echo "3. S3 Bucket Policy (Public Access)..."
# Test 3: Check bucket policy
aws s3api get-bucket-policy --bucket barrydale-media 2>/dev/null || echo "No bucket policy found (this is normal for CORS-only access)"

echo ""
echo "4. S3 Bucket ACL..."
# Test 4: Check bucket ACL
aws s3api get-bucket-acl --bucket barrydale-media

echo ""
echo "✅ Test completed. Check the results above."
echo "If upload URL generation works, the CORS issue should be resolved."
