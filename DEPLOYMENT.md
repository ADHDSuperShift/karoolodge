# Karoo Lodge - AWS Deployment Guide

## ✅ Completed Steps

### 1. Backend API Deployment
- **Status**: ✅ DEPLOYED
- **Auth Endpoint**: `https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/get-api-key`
- **Upload Endpoint**: `https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url`
- **Functions**: Lambda functions for authentication and S3 upload URL generation

### 2. Environment Configuration
- **Status**: ✅ CONFIGURED
- **Frontend**: Environment variables updated to use production API endpoints
- **Backend**: Using existing S3 bucket `barrydale-media`

## 🚀 Next Steps: Frontend Deployment with AWS Amplify

### Option 1: Deploy via Amplify Console (Recommended)

1. **Build the Frontend** (if not already done):
   ```bash
   cd "/Users/dirkmarais/Downloads/karoo lodge"
   npm run build
   ```

2. **Go to AWS Amplify Console**:
   - Open: https://console.aws.amazon.com/amplify/
   - Click "Host web app"

3. **Choose Deployment Method**:

   **Option A: Drag & Drop (Quick)**
   - Select "Deploy without Git provider"
   - Drag and drop the `dist` folder
   - Click "Save and deploy"

   **Option B: GitHub Integration (CI/CD)**
   - Select "GitHub"
   - Connect your GitHub account
   - Choose repository: `ADHDSuperShift/karoolodge`
   - Branch: `main`
   - Amplify will automatically use the `amplify.yml` configuration

4. **Environment Variables** (if using GitHub integration):
   - In Amplify Console, go to "Environment variables"
   - Add the following:
     ```
     VITE_COGNITO_USER_POOL_ID=us-east-1_fzogF46tc
     VITE_COGNITO_CLIENT_ID=3d3cij4c87drjkuko3np8lmn1d
     VITE_AUTH_ENDPOINT=https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/get-api-key
     VITE_UPLOAD_ENDPOINT=https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url
   VITE_CLOUDFRONT_URL=https://d3ieyce90rkgk7.cloudfront.net
     ```

5. **Domain Setup** (Optional):
   - In Amplify Console, go to "Domain management"
   - Add custom domain if needed
   - Amplify provides a default `.amplifyapp.com` domain

### Option 2: Manual S3 + CloudFront Setup

If you prefer to use S3 + CloudFront directly:

1. **Deploy CloudFormation Stack**:
   ```bash
   aws cloudformation create-stack \
     --stack-name karoo-lodge-frontend \
     --template-body file://cloudformation-s3-cloudfront.yaml \
     --region us-east-1
   ```

2. **Upload Built Files**:
   ```bash
   aws s3 sync dist/ s3://your-frontend-bucket-name/ --delete
   ```

3. **Invalidate CloudFront Cache**:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

## 🔧 Current Configuration

### Backend Services
- **Lambda Functions**: 2 functions deployed
- **API Gateway**: REST API with CORS enabled
- **S3 Bucket**: `barrydale-media` (existing)
- **IAM Roles**: Configured for S3 access

### Frontend Configuration
- **Framework**: React + TypeScript + Vite
- **Authentication**: AWS Cognito User Pool
- **Build Output**: `dist/` folder
- **Environment**: Production-ready

### Authentication Details
- **User Pool**: `us-east-1_fzogF46tc`
- **Test User**: `test@example.com` / `TestPassword123`
- **Client ID**: `3d3cij4c87drjkuko3np8lmn1d`

## 🏁 Final Steps After Deployment

1. **Test Authentication**:
   - Visit the deployed Amplify URL
   - Sign in with test credentials
   - Verify admin functionality

2. **Test File Uploads**:
   - Upload images in the admin panel
   - Verify they appear via CloudFront URL

3. **Domain Configuration** (if needed):
   - Configure custom domain in Amplify
   - Update DNS records

## 📞 Support

- **AWS Amplify Console**: https://console.aws.amazon.com/amplify/
- **CloudFormation Console**: https://console.aws.amazon.com/cloudformation/
- **Lambda Console**: https://console.aws.amazon.com/lambda/

---

**Status**: Backend ✅ | Frontend 🔄 (Ready for Amplify deployment)
