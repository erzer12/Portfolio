# Portfolio - Harshil P

A modern, cinematic portfolio website built with Next.js 15, React 19, and Firebase. Features a stunning dark theme with smooth animations, custom cursor effects, and a full-featured admin panel for content management.

## 🌟 Features

### Frontend
- **Cinematic Design**: Dark theme with glassmorphism, smooth animations, and custom cursor effects
- **Responsive Layout**: Fully responsive design optimized for all devices
- **Dynamic Background**: Animated particle effects and interactive visuals
- **Project Showcase**: Horizontal scrolling carousel on desktop, vertical stack on mobile
- **Certifications**: Automatic Credly badge import with carousel display
- **Work Experience**: Timeline-based experience visualization
- **Contact Form**: Dual-mode form (contact messages + testimonial reviews)
- **Admin Panel**: Hidden keyboard shortcut for content management

### Backend
- **Firebase Firestore**: Real-time NoSQL database for all portfolio content
- **Server Actions**: Type-safe server-side operations with Zod validation
- **Image Management**: Local file uploads to `public/images/` with smart URL resolution
- **Email Integration**: Contact form emails via Resend API
- **Security**: Server-side only database writes, access code protection

### Developer Experience
- **TypeScript**: Strict mode for complete type safety
- **Next.js 15**: Latest App Router with Turbopack
- **React 19**: Latest React features
- **Prettier**: Consistent code formatting
- **Error Boundaries**: Graceful error handling in production
- **Environment Validation**: Startup checks for required variables

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15.5.7](https://nextjs.org/)
- **Runtime**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### UI & Animation
- **Components**: [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Smooth Scroll**: [Lenis](https://lenis.studiofreight.com/)

### Backend & Data
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Storage**: Local filesystem (`public/images/`)
- **Email**: [Resend](https://resend.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project ([Create one](https://console.firebase.google.com/))
- (Optional) Resend account for contact form emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

   # Email Service (Optional)
   RESEND_API_KEY=re_your_api_key

   # Admin Access
   ADMIN_ACCESS_CODE=your_secure_code_here
   ```

4. **Configure Firebase**
   - Create a Firestore database
   - Deploy security rules:
     ```bash
     firebase deploy --only firestore:rules
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── actions.ts         # Server actions
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── admin/             # Admin panel components
│   ├── cinematic/         # Main portfolio components
│   ├── quantum/           # Special effect components
│   ├── bento/             # Bento grid components
│   ├── ui/                # Shadcn UI components
│   └── ErrorBoundary.tsx  # Error handling
├── hooks/                 # Custom React hooks
│   ├── use-data.ts       # Firebase data hooks
│   └── use-mobile.tsx    # Mobile detection
├── lib/                   # Utilities
│   ├── firebase.ts       # Firebase config
│   ├── env.ts            # Environment validation
│   └── utils.ts          # Helper functions
└── data/                  # Static/seed data
```

## 🎨 Admin Panel

### Access
1. Navigate to your portfolio
2. Press `Shift + A + D`
3. Enter your `ADMIN_ACCESS_CODE`

### Features
- **Projects**: Add, edit, delete projects with image uploads
- **Skills**: Manage skill categories and items
- **Experience**: Edit work history
- **Education**: Update educational background
- **Certifications**: Import from Credly or add manually
- **Testimonials**: Approve and manage reviews

### Image Uploads
- **Local Storage**: Files saved to `public/images/`
- **Smart URL Resolver**: Automatically extracts direct image URLs from hosting page links
- **Supported Sources**: Direct URLs, Firebase Storage, ibb.co, Credly
- **Recommended Resolution**: 1920x1080 (16:9) for projects

## 📧 Contact Form Setup

1. **Sign up for Resend**: https://resend.com
2. **Verify your domain** or use their testing domain
3. **Create API key** in Resend dashboard
4. **Add to `.env`**: `RESEND_API_KEY=re_your_key`
5. **Update email addresses** in `src/app/actions.ts`:
   ```typescript
   from: 'Portfolio <noreply@yourdomain.com>',
   to: ['your-email@example.com'],
   ```

## 🔒 Security

- **Database**: All writes restricted to server-side only (Firestore rules)
- **Admin Access**: Protected by access code verification
- **Image Domains**: Whitelisted sources only (no wildcards)
- **Type Safety**: Strict TypeScript + Zod validation
- **Environment Validation**: Startup checks for required variables

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run start
```

### Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Important**: Local file upload (`/api/upload`) is development-only. For production on serverless platforms like Vercel, use Firebase Storage or a cloud CDN.

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## 🧪 Scripts

```bash
npm run dev        # Start development server (port 9002)
npm run build      # Create production build
npm run start      # Start production server
npm run typecheck  # Run TypeScript type checking
npm run lint       # Lint code
```

## 🎯 Key Features by Component

### `MinimalNav.tsx`
Sticky glassmorphism navbar with smooth scroll navigation

### `ProjectShowcase.tsx`
Responsive project carousel with image rendering and modal details

### `ContactSection.tsx`
Dual-mode form (contact/review) with Resend email integration

### `AdminDataPanel.tsx`
Full CRUD operations for all content types with real-time updates

### `Certifications.tsx`
Auto-import Credly badges with carousel display

### `CustomCursor.tsx`
Desktop-only custom cursor with hover effects (hidden on mobile)

## 🐛 Known Issues & Limitations

- **Local Uploads**: Not compatible with serverless deployment (use Firebase Storage for production)
- **Environment Variables**: Must be set for build to succeed
- **Custom Cursor**: Only works on desktop (touch devices show native cursor)

## 📝 License

Private - All Rights Reserved

## 👤 Author

**Harshil P**
- Portfolio: [harshilp.codes](https://harshilp.codes)
- Email: harshilp1234@gmail.com

---

Built with ❤️ using Next.js 15 and React 19
