# 🚀 Portfolio - Next.js Application

A modern, secure portfolio website built with Next.js 16, Firebase, and featuring enterprise-grade security.

## ✨ Features

- 🎨 **Cinematic UI/UX** - Modern, dynamic design with smooth animations
- 🔐 **Enterprise Security** - Comprehensive security headers, session management, and protected APIs
- 📱 **Fully Responsive** - Optimized for all devices
- 🎯 **Admin Panel** - Complete content management system
- 📬 **Contact Form** - Email integration with Resend
- 🏆 **Certifications** - Automatic Credly badge import
- 📊 **GitHub Integration** - Showcase your repositories

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (with Turbopack)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Authentication:** Server-side session management
- **Email:** Resend API
- **Styling:** Tailwind CSS + Vanilla CSS
- **Security:** Firebase Admin SDK, HTTP security headers, CSRF protection

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env
# Edit .env with your actual values

# Run development server
npm run dev
```

## 🔑 Environment Variables

### Required Variables

Create a `.env` file in the project root with these variables:

#### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Firebase Service Account (CRITICAL for Server Actions)
```bash
# Get from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

#### Admin Access
```bash
ADMIN_ACCESS_CODE=your-secure-admin-password
NEXT_PUBLIC_ADMIN_CODE=your-secure-admin-password  # Optional: for client-side fallback
```

### Optional Variables

#### Email (Resend)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Portfolio <noreply@yourdomain.com>"
EMAIL_TO="your-email@example.com"
```

#### GitHub API
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx  # For higher rate limits
```

See `.env.example` for a complete template.

## 🚀 Deployment

### Vercel (Recommended)

1. **Add Environment Variables** to Vercel:
   - Go to Project Settings → Environment Variables
   - Add ALL variables from your `.env` file
   - **Important:** Add `FIREBASE_SERVICE_ACCOUNT_KEY` for production

2. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Push to Git**:
   ```bash
   git push origin main
   ```

Vercel will auto-deploy your site.

### Production Checklist

- [ ] All environment variables added to Vercel
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` configured
- [ ] Firestore security rules deployed
- [ ] Admin access code is strong (16+ characters)
- [ ] Test admin panel functionality
- [ ] Verify contact form works

## 🔒 Security Features

This application implements enterprise-grade security:

- ✅ **Firebase Admin SDK** - Server-side operations bypass client rules
- ✅ **Strict Firestore Rules** - Client-side writes are blocked
- ✅ **Session Timeout** - 30-minute automatic logout
- ✅ **Security Headers** - HSTS, X-Frame-Options, CSP, etc.
- ✅ **Protected File Uploads** - Authentication required
- ✅ **SSRF Protection** - Validated external URL fetching
- ✅ **Security Event Logging** - Track authentication events

## 📝 Admin Panel

Access the admin panel at `/admin` with your access code.

**Features:**
- Manage projects, skills, certifications
- Update work experience and education
- Review and approve testimonials
- Import Credly badges automatically
- Upload images securely

## 🐛 Troubleshooting

### "PERMISSION_DENIED" Error in Production

**Cause:** Missing Firebase service account key.

**Solution:**
1. Generate service account key from Firebase Console
2. Add `FIREBASE_SERVICE_ACCOUNT_KEY` to Vercel environment variables
3. Redeploy

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

### Admin Panel Not Working

1. Verify `ADMIN_ACCESS_CODE` is set in environment variables
2. Check Firestore rules are deployed
3. Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is configured

## 📚 Documentation

- [Security Analysis Report](./docs/security_analysis_report.md)
- [Security Fixes Walkthrough](./docs/security_fixes_walkthrough.md)
- [Production Troubleshooting](./docs/production_troubleshooting.md)
- [Environment Variables Guide](./ENV_VARIABLES.md)

## 🔄 NPM Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Vercel for hosting
- All open-source contributors

---

**⚡ Built with Next.js 16 + Firebase + Security First**
