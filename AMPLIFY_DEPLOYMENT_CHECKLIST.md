# 🚨 AMPLIFY DEPLOYMENT CHECKLIST

## ✅ What to Check in Amplify Console:

### 1. Build Status
- [ ] Go to AWS Amplify Console
- [ ] Check that a new build is triggered (should be running now)
- [ ] Verify build is pulling from commit `a2b2043` or later
- [ ] Wait for build to complete (usually 2-5 minutes)

### 2. Branch Configuration
- [ ] Go to **App settings** → **General**
- [ ] Verify **Branch** is set to `main`
- [ ] Check **Build command** shows: `npm run build`

### 3. Environment Variables (CRITICAL!)
- [ ] Go to **App settings** → **Environment variables**
- [ ] Verify these are set:
  ```
  VITE_AUTH_ENDPOINT = https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/get-api-key
  VITE_UPLOAD_ENDPOINT = https://maqo72gd3h.execute-api.us-east-1.amazonaws.com/dev/api/upload-url
  VITE_COGNITO_USER_POOL_ID = us-east-1_fzogF46tc
  VITE_COGNITO_CLIENT_ID = 3d3cij4c87drjkuko3np8lmn1d
  ```
- [ ] If missing: Add them and **Redeploy**

### 4. After Build Completes
- [ ] Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on PC)
- [ ] Visit your Amplify URL `/admin`
- [ ] Check if you see "v2.0.0 - Full Admin System" in the header
- [ ] Try logging in with Cognito credentials

## 🔧 If Still Showing Old Version:

### Option 1: Manual Redeploy
- [ ] Go to Amplify Console → **App settings** → **Build settings**
- [ ] Click **Redeploy this version**
- [ ] Wait for rebuild to complete

### Option 2: Cache Issues
- [ ] Try incognito/private browser window
- [ ] Clear all browser cache and cookies
- [ ] Try different browser

### Option 3: Build Settings Check
- [ ] Verify build command in amplify.yml is working:
  ```
  build:
    commands:
      - npm run build
      - cp public/_redirects dist/_redirects
  ```

## 🎯 Success Indicators:
- ✅ Admin page loads at `/admin` without 404
- ✅ Shows "v2.0.0 - Full Admin System" in header
- ✅ Cognito login form appears
- ✅ After login, drag & drop upload works
- ✅ Image uploads to S3 successfully

## 🚨 Emergency Access:
If `/admin` still shows 404, try:
- `/admin-access.html` (backup access page)
- Manual redirect configuration in Amplify console

---

**Latest Commit:** a2b2043 (v2.0.0)
**Deployment Date:** September 25, 2025
