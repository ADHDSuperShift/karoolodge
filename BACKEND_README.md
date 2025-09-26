# Karoo Lodge Backend - AWS Serverless

A complete serverless backend for the Karoo Lodge administration system built on AWS.

## Architecture

- **Authentication**: AWS Cognito User Pool with JWT tokens
- **Database**: DynamoDB with 4 tables (Gallery, Rooms, Wines, Settings)
- **File Storage**: S3 with CloudFront CDN
- **API**: Lambda functions with API Gateway
- **Region**: us-east-1

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
   ```bash
   aws configure
   ```

2. **Node.js** (v18 or later)
   ```bash
   node --version
   ```

3. **Serverless Framework**
   ```bash
   npm install -g serverless
   ```

## Deployment

### Quick Deploy
```bash
./deploy.sh
```

### Manual Deploy
```bash
# Install dependencies
npm install

# Deploy to AWS
serverless deploy --region us-east-1

# Get deployment info
serverless info --region us-east-1
```

## API Endpoints

After deployment, you'll have these endpoints:

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/refresh` - Refresh JWT token

### Gallery Management
- `GET /gallery` - List all gallery images
- `GET /gallery?category=rooms` - Filter by category
- `POST /gallery` - Create new gallery item (protected)
- `PUT /gallery/{id}` - Update gallery item (protected)
- `DELETE /gallery/{id}` - Delete gallery item (protected)

### Room Management
- `GET /rooms` - List all rooms
- `PUT /rooms` - Batch update rooms (protected)

### Wine Collection
- `GET /wines` - List all wines
- `GET /wines?category=red` - Filter by category
- `PUT /wines` - Batch update wines (protected)

### Settings
- `GET /settings` - Get all settings
- `PUT /settings` - Update settings (protected)

### File Upload
- `POST /upload` - Get presigned S3 upload URL (protected)

## Environment Variables

The serverless deployment will create these resources and outputs:

- **CognitoUserPoolId**: User pool for authentication
- **CognitoUserPoolClientId**: Client ID for authentication
- **S3BucketName**: Storage bucket for media files
- **CloudFrontDomainName**: CDN domain for media access
- **ApiUrl**: Base API Gateway URL

## Database Schema

### Gallery Table
```
{
  id: string (partition key)
  title: string
  description?: string
  imageUrl: string
  category: string (GSI)
  createdAt: string
  updatedAt: string
}
```

### Rooms Table
```
{
  id: string (partition key)
  name: string
  description: string
  price: number
  images: string[]
  amenities: string[]
  createdAt: string
  updatedAt: string
}
```

### Wines Table
```
{
  id: string (partition key)
  name: string
  winery: string
  vintage?: number
  category: string (GSI)
  price?: number
  description?: string
  createdAt: string
  updatedAt: string
}
```

### Settings Table
```
{
  key: string (partition key)
  value: any
  updatedAt: string
}
```

## Security

- All protected endpoints require JWT authentication
- Cognito User Pool provides secure user management
- S3 bucket uses presigned URLs for secure uploads
- CloudFront Origin Access Identity restricts direct S3 access
- CORS configured for frontend domain

## Development

### Local Testing
```bash
# Install dependencies
npm install

# Run local development
serverless offline --region us-east-1
```

### Remove Deployment
```bash
serverless remove --region us-east-1
```

## Frontend Integration

Update your frontend environment variables with the deployment outputs:

```env
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=<UserPoolId from output>
VITE_COGNITO_USER_POOL_CLIENT_ID=<UserPoolClientId from output>
VITE_API_URL=<ApiUrl from output>
VITE_S3_BUCKET=<S3BucketName from output>
VITE_CLOUDFRONT_URL=<CloudFrontDomainName from output>
```

## Admin User Setup

After deployment, create an admin user in Cognito:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username admin \
  --user-attributes Name=email,Value=admin@karoolodge.com \
  --temporary-password TempPass123! \
  --message-action SUPPRESS \
  --region us-east-1

aws cognito-idp admin-set-user-password \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username admin \
  --password YourSecurePassword123! \
  --permanent \
  --region us-east-1
```

## Support

For issues or questions, check the deployment logs:

```bash
serverless logs -f auth --region us-east-1
serverless logs -f gallery --region us-east-1
```
