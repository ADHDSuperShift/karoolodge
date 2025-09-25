# Karoo Lodge – Frontend + AWS Upload Service

This project combines a Vite + React admin/front-of-house UI with a lightweight AWS-backed upload microservice. The frontend requests short-lived pre-signed S3 URLs from the backend so large media files can be uploaded directly to Amazon S3 without routing binary data through your server.

## Prerequisites

- Node.js 18+
- An AWS account with permission to create S3 buckets, IAM users/roles, and (optionally) Lambda + API Gateway resources
- An S3 bucket dedicated to site assets (images, documents, etc.)

## Configure Environment Variables

1. Copy `.env.example` to `.env` and fill in the values for your environment:

   ```bash
   cp .env.example .env
   ```

2. Populate the file:

   - `AWS_REGION`: AWS region where your S3 bucket lives (e.g. `us-east-1`).
   - `AWS_S3_BUCKET`: Name of the bucket that receives uploaded files.
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: Credentials with `s3:PutObject` and `s3:GetObject` access to the bucket (only required for local/server environments—managed credentials are used in Lambda).
   - `UPLOAD_API_KEY`: Shared secret the backend expects on all requests (keep this secret!)
   - `COGNITO_REGION`: The AWS region where your Cognito User Pool resides.
   - `COGNITO_USER_POOL_ID`: Cognito User Pool that stores admin accounts.
   - `COGNITO_CLIENT_ID`: App client (no secret) used for SRP authentication.
   - `PORT`: Port for the local Express upload server (defaults to `4000`).
   - `VITE_UPLOAD_ENDPOINT`: Upload API base URL used by the frontend (defaults to the local server).
   - `VITE_AUTH_ENDPOINT`: API endpoint that exchanges Cognito ID tokens for the upload API key (defaults to `http://localhost:4000/api/auth/api-key`).
   - `VITE_COGNITO_USER_POOL_ID`: Frontend copy of `COGNITO_USER_POOL_ID`.
   - `VITE_COGNITO_CLIENT_ID`: Frontend copy of `COGNITO_CLIENT_ID`.

Never commit the populated `.env` file.

## Run the Upload Server Locally

The Express service lives in `server/index.mjs` and exposes:

- `POST /api/auth/api-key` – validates a Cognito ID token and returns the upload API key.
- `POST /api/upload-url` – returns a one-minute S3 pre-signed PUT URL (requires `x-api-key`).

```bash
npm run server
```

The server validates the AWS environment variables on startup. Once running, the frontend can call `http://localhost:4000/api/upload-url` (or whatever you set via `VITE_UPLOAD_ENDPOINT`).

### Test the Endpoint

```bash
curl -X POST http://localhost:4000/api/upload-url \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <your-api-key>' \
  -d '{"fileName":"sample.jpg","fileType":"image/jpeg","folder":"gallery"}'
```

The response will include an `uploadUrl`, `publicUrl`, and S3 `key`. Use the `uploadUrl` with an HTTP `PUT` to send the file directly to S3.

## Deploy as AWS Lambda (Optional)

There is a functionally equivalent Lambda handler in `lambda-upload-url/index.mjs`. Bundle it (together with its dependencies) via esbuild and package it for deployment:

```bash
# Produces lambda-upload-url/dist/index.mjs (bundled, tree-shaken)
npm run lambda:bundle

# Bundles and zips to lambda-upload-url.zip
npm run lambda:package
```

Upload `lambda-upload-url.zip` when creating your Lambda function (Node.js 20 runtime). Set the handler to `index.handler` and configure environment variables `AWS_REGION` and `AWS_S3_BUCKET` (or `S3_BUCKET`) to match your bucket. Attach an execution role with permission to call `s3:PutObject` on the bucket.

Expose the Lambda through API Gateway (HTTP API, `POST /api/upload-url`) with CORS enabled so the browser can reach it.

### Secure the Endpoint with API Gateway

1. In API Gateway, create an API key and usage plan.
2. Associate the usage plan with the deployed stage so API Gateway enforces the key.
3. Distribute the API key securely (never hard-code in client bundles served to untrusted users; store it in a secure config if the admin UI is gated).
4. When calling the API, pass the key via the `x-api-key` header. The Express server and Lambda handler both validate this header before minting upload URLs.

## Cognito Authentication Flow

1. Deploy the Cognito stack and export environment variables in one step (requires the AWS CLI to be configured):

   ```bash
   AWS_REGION=us-east-1 ./scripts/deploy-cognito.sh
   ```

   Customize the stack name, project prefix, or admin group with optional arguments:

   ```bash
   AWS_REGION=us-east-1 ./scripts/deploy-cognito.sh my-stack my-project moderators
   ```

   The script wraps `aws cloudformation deploy` using `infra/cognito-stack.yaml`, waits for completion, then writes `.env.cognito` with the output values. Merge that file into your backend `.env` and set the `VITE_` equivalents.

2. Add admin users to the pool and assign them to the exported admin group. You can invite users via the AWS Console or with the CLI:

   ```bash
   aws cognito-idp admin-create-user \
     --user-pool-id <COGNITO_USER_POOL_ID> \
     --username admin@example.com \
     --user-attributes Name="email",Value="admin@example.com" \
     --desired-delivery-mediums EMAIL

   aws cognito-idp admin-add-user-to-group \
     --user-pool-id <COGNITO_USER_POOL_ID> \
     --username admin@example.com \
     --group-name <COGNITO_ADMIN_GROUP>
   ```

3. The admin UI prompts for Cognito credentials. After a successful sign-in, it submits the Cognito ID token to `POST /api/auth/api-key`, which verifies the token and returns the upload API key for subsequent `POST /api/upload-url` requests. The key is held in memory only for the authenticated session.

## Recommended AWS IAM Policy

Create a policy scoped to your bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::<your-bucket-name>/*"
    }
  ]
}
```

Attach this policy to the IAM user used locally or to the Lambda execution role.

## Hardening Suggestions

- Protect the upload endpoint with authentication (JWT/API key/Supabase auth) before exposing it publicly.
- Keep the API key in a secure config store and serve it only to authenticated admin clients (do not embed it in public bundles).
- Configure S3 lifecycle rules to clean up unused uploads.
- Add metadata validation (file size/type) before issuing pre-signed URLs to restrict what gets stored in S3.

## Frontend Development

```bash
npm install
npm run dev
```

The admin tools read from `src/contexts/GlobalStateContext.tsx` by default. When you build out persistence, replace the hard-coded data with API calls that persist to your backend of choice (Supabase, DynamoDB, etc.).
