# S3 BUCKET PUBLIC ACCESS SETUP

## IMMEDIATE FIX: Allow Public Read Access

### Step 1: Unblock Public Access
1. Go to **S3 Console** → `barrydale-media` bucket
2. Click **Permissions** tab
3. Click **Edit** on "Block public access (bucket settings)"
4. **UNCHECK** "Block all public access"
5. Click **Save changes**
6. Type `confirm` and click **Confirm**

### Step 2: Add Bucket Policy
1. Still in **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste this policy:

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

5. Click **Save changes**

### Step 3: Test Upload
1. Go to your admin console: http://localhost:8086/admin
2. Upload a test image
3. The image should now display immediately!

---

**URLs will now be**: `https://barrydale-media.s3.eu-west-1.amazonaws.com/rooms/filename.jpg`

**This works immediately** - no waiting for CloudFront deployment!
