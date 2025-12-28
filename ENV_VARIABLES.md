# Environment Variables Setup Guide

## Required Environment Variables

### Firebase Configuration (Required for all features)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Admin Access (Required for admin panel)
```bash
ADMIN_ACCESS_CODE=your-secure-access-code
NEXT_PUBLIC_ADMIN_CODE=your-secure-access-code
```

## Optional Environment Variables

### Email (Resend)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Portfolio <noreply@yourdomain.com>"
EMAIL_TO="your-email@example.com"
```

### GitHub API
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## Setup Instructions

1. Copy this file content to `.env` in project root
2. Replace all placeholder values with your actual credentials
3. Restart development server: `npm run dev`

## Production Deployment

Add all variables to your hosting platform:
- **Vercel**: Settings → Environment Variables
- **Firebase**: Functions config or App Hosting settings

## Security Notes
- Never commit `.env` to git (already in `.gitignore`)
- Use different codes for dev/prod
- Regenerate if compromised
