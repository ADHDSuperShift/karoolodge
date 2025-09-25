# CREATE NEW CLOUDFRONT DISTRIBUTION

## Step-by-Step Instructions:

### 1. Go to AWS Console → CloudFront
- Open AWS Console
- Search for "CloudFront" 
- Click "Create Distribution"

### 2. Configure Origin Settings:
- **Origin Domain**: `barrydale-media.s3.eu-west-1.amazonaws.com`
- **Origin Path**: (leave empty)
- **Name**: `barrydale-media-origin`

### 3. Configure Default Cache Behavior:
- **Viewer Protocol Policy**: `Redirect HTTP to HTTPS`
- **Allowed HTTP Methods**: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- **Cache Policy**: `CachingOptimized`
- **Origin Request Policy**: `CORS-S3Origin`

### 4. Configure Distribution Settings:
- **Price Class**: `Use All Edge Locations (Best Performance)`
- **Alternate Domain Names (CNAMEs)**: (leave empty for now)
- **Default Root Object**: (leave empty)

### 5. Create Distribution
- Click "Create Distribution"
- **WAIT 10-15 minutes** for deployment
- Status will change from "Deploying" to "Deployed"

### 6. Copy New Domain Name
- You'll get a domain like: `d1234567890abc.cloudfront.net`
- **COPY THIS DOMAIN** - you'll need to update your code

### 7. Set S3 Bucket Policy
Go to S3 Console → barrydale-media → Permissions → Bucket Policy:

```json
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
```

### 8. Update Your Code
Replace all instances of `d3ieyce90rkgk7.cloudfront.net` with your new domain.

---

**ESTIMATED TIME**: 20-30 minutes total (mostly waiting for CloudFront deployment)
