# Personal Portfolio & Headless CMS

A minimalist, typography-driven personal portfolio built with **Next.js** and a custom **Supabase Headless CMS**. Designed to be a resume-first experience that is blazing fast, easy to maintain, and simple to update on the fly.

## 🚀 Features

- **Resume-First Design:** Clean, distraction-free UI focused on content, typography, and professional presentation.
- **Custom Admin Panel (`/admin`):** A fully authenticated headless CMS built directly into the app to manage all content.
- **Drag & Drop Reordering:** Organize your projects, experience, and approved testimonials visually using `@dnd-kit`.
- **GitHub Importer:** Instantly add projects to your portfolio by pasting a GitHub repository URL—automatically fetches the title, description, and tags.
- **Media Management:** Securely upload project thumbnails and resume PDFs directly to Supabase Storage from the admin dashboard.
- **Public Testimonials:** Visitors can submit testimonials via the Contact section, which are held in a "Pending" state until approved from the admin panel.
- **Next.js Server Actions:** All data mutations run securely on the server with instant cache revalidation for real-time updates.

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Custom Design Tokens & CSS Variables)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Storage:** Supabase Storage (for images and PDFs)
- **Drag & Drop:** `@dnd-kit`

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/erzer12/Portfolio.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/schema.sql` and run it to set up all tables, Row Level Security (RLS) policies, and the `portfolio_media` storage bucket.

### 4. Environment Variables
Create a `.env.local` file in the root directory and add the following keys from your Supabase project:

```env
# Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"

# Your Supabase Anon Key (for public reads)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# Your Supabase Service Role Key (for admin writes - NEVER share this)
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."

# A secret passcode of your choice to access the /admin page
ADMIN_ACCESS_CODE="your-super-secret-password"
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🛡️ Accessing the Admin Panel

1. Navigate to `/admin` in your browser.
2. Enter the passcode you defined in `ADMIN_ACCESS_CODE`.
3. You now have full access to add, edit, reorder, and delete any content on your site!

## 📝 License

MIT License - feel free to clone, modify, and use this for your own personal portfolio!
