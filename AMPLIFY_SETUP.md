# Amplify Environment Variables Setup

To deploy the Karoo Lodge admin system on Amplify, you need to configure these environment variables in the Amplify Console:

## Required Environment Variables

Go to **App settings** → **Environment variables** in your Amplify app and add:

| Variable Name | Value |
|---------------|-------|
| `VITE_AUTH_ENDPOINT` | `https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/get-api-key` |
| `VITE_UPLOAD_ENDPOINT` | `https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url` |
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_fzogF46tc` |
| `VITE_COGNITO_CLIENT_ID` | `3d3cij4c87drjkuko3np8lmn1d` |

## After Setting Variables

1. Save the environment variables
2. Go to **App settings** → **Build settings** 
3. Click **Redeploy this version** to trigger a new build with the environment variables

## SPA Routing Fix

If you're still getting 404 errors on `/admin`, you need to configure redirects manually in the Amplify Console:

### Option 1: Automatic (should work with latest deployment)
- ✅ `_redirects` file included in build
- ✅ Updated `amplify.yml` with SPA configuration

### Option 2: Manual Console Configuration (if automatic doesn't work)
1. Go to your Amplify app in the AWS Console
2. Click on **App Settings** → **Rewrites and redirects**
3. Click **Add rule** and configure:

| Source Address | Target Address | Type | Country Code |
|----------------|----------------|------|--------------|
| `</admin>` | `/index.html` | `200 (Rewrite)` | - |
| `</admin/*>` | `/index.html` | `200 (Rewrite)` | - |
| `</*>` | `/index.html` | `404 (Rewrite)` | - |

4. Click **Save**
5. **Redeploy** your app

### Option 3: Test with Hash Routing (temporary workaround)
If redirects still don't work, the admin can be accessed at:
- `https://your-app-url.amplifyapp.com/#/admin`

## Admin Access

Once deployed, access the admin dashboard at: `https://your-app-url.amplifyapp.com/admin`

The admin system includes:
- ✅ AWS Cognito authentication
- ✅ Drag & drop image upload
- ✅ Room management system
- ✅ Gallery management
- ✅ Wine collection management
- ✅ Content editing capabilities
