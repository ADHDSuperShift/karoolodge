#!/bin/bash

echo "=================================="
echo "CLOUDFRONT S3 FIX - STEP BY STEP"
echo "=================================="

echo "Based on the issue analysis, here are the commands to run:"
echo ""

echo "STEP 1: Find files in folders that need to be moved to root"
echo "-----------------------------------------------------------"
echo "aws s3 ls s3://barrydale-media --recursive | grep -v '^[[:space:]]*[^/]*$'"
echo ""

echo "STEP 2: Move each file from folder to bucket root"
echo "------------------------------------------------"
echo "Example commands (replace with actual filenames found in step 1):"
echo ""
echo "# If you find files like:"
echo "# gallery/1234567890_image.jpg"
echo "# rooms/1234567890_room.jpg"
echo "# backgrounds/1234567890_bg.jpg"
echo ""
echo "# Move them to root with:"
echo "aws s3 mv s3://barrydale-media/gallery/FILENAME s3://barrydale-media/FILENAME"
echo "aws s3 mv s3://barrydale-media/rooms/FILENAME s3://barrydale-media/FILENAME"
echo "aws s3 mv s3://barrydale-media/backgrounds/FILENAME s3://barrydale-media/FILENAME"
echo ""

echo "STEP 3: Get CloudFront distribution ID"
echo "-------------------------------------"
echo "aws cloudfront list-distributions --query \"DistributionList.Items[*].[Id,DomainName]\" --output table"
echo "# Look for the distribution with d3ieyce90rkgk7.cloudfront.net"
echo ""

echo "STEP 4: Invalidate CloudFront cache"
echo "----------------------------------"
echo "aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths \"/*\""
echo ""

echo "STEP 5: Test access"
echo "------------------"
echo "curl -I \"https://d3ieyce90rkgk7.cloudfront.net/FILENAME\""
echo ""

echo "ALTERNATIVE: Manual approach via AWS Console"
echo "==========================================="
echo "1. Go to S3 Console → barrydale-media bucket"
echo "2. Find files in gallery/, rooms/, backgrounds/ folders"
echo "3. Select each file → Actions → Copy"
echo "4. Paste in bucket root (remove folder from destination)"
echo "5. Go to CloudFront Console → Find distribution for d3ieyce90rkgk7.cloudfront.net"
echo "6. Create invalidation for /* paths"
echo ""

# Try to run the actual commands
echo "ATTEMPTING AUTOMATIC EXECUTION:"
echo "==============================="

echo "Checking S3 contents..."
timeout 30s aws s3 ls s3://barrydale-media --recursive 2>/dev/null || echo "S3 command timed out - use manual approach"

echo ""
echo "Checking CloudFront distributions..."
timeout 30s aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName]" --output table 2>/dev/null || echo "CloudFront command timed out - use AWS Console"

echo ""
echo "=== SCRIPT COMPLETE ==="
