# Karoo Lodge Admin Console - Cognito Sign In

## 🔐 **Admin Credentials**

### **Primary Admin Account (Cognito)**
- **Email:** `admin@karoolodge.com`
- **Password:** `KarooLodgeAdmin2025!`
- **Status:** Active ✅
- **User Pool:** `us-east-1_0zdq1WKtP`

### **Fallback Admin Account (Local)**
- **Email:** `admin@example.com`
- **Password:** `temporary123`
- **Note:** Only works when Cognito fails

---

## 🚀 **How to Access Admin Console**

1. **Go to your app:** `http://localhost:8083/` (local) or your deployed URL
2. **Login with Cognito credentials:** 
   - Email: `admin@karoolodge.com`
   - Password: `KarooLodgeAdmin2025!`
3. **Access admin features:**
   - Gallery management
   - Room management
   - Content editing
   - S3 file uploads (authenticated)
   - User management

---

## 📋 **Admin Features Available**

### **With Cognito Authentication:**
- ✅ **S3 File Uploads** - Full cloud storage access
- ✅ **Gallery Management** - Add/edit/delete images
- ✅ **Room Management** - Configure all room details
- ✅ **Content Editor** - Update website content
- ✅ **User Management** - Create additional Cognito users
- ✅ **Background Uploads** - Section background images

### **Security Features:**
- ✅ **AWS Cognito Integration** - Secure authentication
- ✅ **Identity Pool Access** - S3 upload permissions
- ✅ **Session Management** - Persistent login
- ✅ **Fallback Authentication** - Backup access method

---

## 🛠 **Troubleshooting**

### **If Cognito login fails:**
1. Use fallback credentials: `admin@example.com` / `temporary123`
2. Check AWS console for user status
3. Verify internet connection for AWS services

### **If S3 uploads fail:**
- System will automatically fallback to base64 storage
- Look for toast message indicating upload method
- Check browser console for detailed error messages

---

## 🔄 **Adding More Admin Users**

Use the "Users" tab in admin console to create additional Cognito users, or run:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_0zdq1WKtP \
  --username newuser@karoolodge.com \
  --user-attributes Name=email,Value=newuser@karoolodge.com \
  --temporary-password TempPass123! \
  --region us-east-1
```

---

**Created:** September 26, 2025  
**User ID:** `548804f8-c011-709f-f15b-8efe5eddc78c`  
**Pool ID:** `us-east-1_0zdq1WKtP`
