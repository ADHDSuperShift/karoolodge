#!/bin/bash

echo "=================================="
echo "CLOUDFRONT / S3 DIAGNOSTIC & FIX"
echo "=================================="

# Step 1: Check S3 bucket contents
echo ""
echo "=== STEP 1: S3 BUCKET CONTENTS ==="
aws s3 ls s3://barrydale-media --recursive | head -20
echo ""

# Step 2: Get CloudFront distribution ID
echo "=== STEP 2: CLOUDFRONT DISTRIBUTION ==="
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, 'd3ieyce90rkgk7.cloudfront.net')].Id" --output text 2>/dev/null)
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "Distribution ID found: $DISTRIBUTION_ID"
else
    echo "Could not get distribution ID - using CLI fallback"
    aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName]" --output table
fi
echo ""

# Step 3: Check bucket policy
echo "=== STEP 3: BUCKET POLICY CHECK ==="
aws s3api get-bucket-policy --bucket barrydale-media --query 'Policy' --output text 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Could not retrieve/format bucket policy"
echo ""

# Step 4: Test current API response
echo "=== STEP 4: UPLOAD API TEST ==="
curl -X POST https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: 79dc174817e715e1f30906b9f4d09be74d0323d8bf387962c95f728762e60159" \
  -d '{"filename": "test-diagnostic.jpg", "contentType": "image/jpeg", "folder": "gallery"}' \
  2>/dev/null | python3 -m json.tool 2>/dev/null || echo "API call failed or response not JSON"
echo ""

# Step 5: Test CloudFront access
echo "=== STEP 5: CLOUDFRONT ACCESS TEST ==="
echo "Testing placeholder.svg access:"
curl -I "https://d3ieyce90rkgk7.cloudfront.net/placeholder.svg" 2>/dev/null | head -3 || echo "CloudFront access test failed"
echo ""

echo "=== DIAGNOSTIC COMPLETE ==="
echo "Review the output above to understand the current state."
echo ""
echo "NEXT STEPS:"
echo "1. If files are in folders (like 'gallery/filename'), they need to be moved to bucket root"
echo "2. Use: aws s3 mv s3://barrydale-media/folder/filename s3://barrydale-media/filename"
echo "3. Then invalidate CloudFront cache with distribution ID"
echo "=================================="
