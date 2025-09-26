# Deployment notes for media uploads

- Error observed: 403 AccessDenied for s3:PutObject when uploading to `backgrounds/...`.
- Cause: Storage access rules allowed only `media/gallery/*` and `media/rooms/*`.
- Fix applied:
  - Updated Amplify Storage rules to include `media/backgrounds/*` and `media/branding/*` with write access for authenticated users.
  - Updated frontend upload paths to always prefix with `media/`.
- Action required: redeploy Amplify backend to apply new Storage policies.

## Redeploy backend

```sh
npx ampx sandbox --once
```

After deploy, sign in to admin and retry uploads.