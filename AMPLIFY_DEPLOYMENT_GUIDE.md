# Karoo Lodge - AWS Amplify Deployment Guide

## 🚀 Next Steps - Deploy Your Backend

Your Amplify backend is configured and ready to deploy! Follow these steps:

### 1. Deploy Amplify Backend

```bash
# Navigate to your project
cd "/Users/dirkmarais/Downloads/karoo lodge"

# Deploy the backend (this creates all AWS resources)
npx ampx sandbox

# Alternative command if above doesn't work:
npx @aws-amplify/backend-cli sandbox
```

**What this does:**
- Creates Cognito User Pool for authentication
- Sets up S3 bucket with CloudFront CDN
- Creates GraphQL API with Lambda resolvers
- Generates `amplify_outputs.json` configuration file

### 2. After Deployment Completes

Once deployed, you'll see output like:
```
✅ Deployed! 
📄 amplify_outputs.json has been generated
🔗 GraphQL endpoint: https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
```

### 3. Update Frontend Configuration

```bash
# The amplify_outputs.json file will be automatically generated
# Update your amplifyconfiguration.ts to use it:
```

Update `/src/amplifyconfiguration.ts`:
```typescript
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
export default outputs;
```

### 4. Test Your App

```bash
# Start your React app
npm run dev

# Your app will now be connected to:
# ✅ AWS Cognito for authentication
# ✅ S3 + CloudFront for media storage
# ✅ GraphQL API for data management
```

## 🔧 What You Get

### Backend Services Created:
- **Authentication**: Cognito User Pool with email login
- **Storage**: S3 bucket with CloudFront CDN
- **API**: GraphQL endpoint with these models:
  - GalleryImage (for photo gallery)
  - Room (for accommodation listings)
  - Wine (for wine collection)
  - Setting (for app configuration)

### Frontend Integration:
- Amplify Data client for GraphQL operations
- Amplify Storage for file uploads
- Amplify Auth for user management

## 🛠️ Troubleshooting

If deployment fails:

1. **Check AWS credentials:**
   ```bash
   aws sts get-caller-identity
   ```

2. **Clear any cached files:**
   ```bash
   rm -rf .amplify
   rm -f amplify_outputs.json
   ```

3. **Try again with verbose output:**
   ```bash
   npx ampx sandbox --debug
   ```

## 📱 Using Your Admin Interface

Once deployed, your admin interface will be able to:

1. **Authenticate** with Cognito
2. **Upload images** to S3 via presigned URLs
3. **Manage gallery** via GraphQL mutations
4. **Configure rooms** and wine collections
5. **Update settings** in real-time

## 🦘 Ready to Go!

Your Karoo Lodge admin system is now powered by:
- **AWS Native Services** (no third-party dependencies)
- **Serverless Architecture** (scales automatically)
- **Modern Stack** (React + TypeScript + Amplify Gen 2)

Happy coding! 🚀
