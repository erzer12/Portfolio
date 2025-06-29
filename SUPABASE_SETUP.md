# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - **Name**: `portfolio-contact-form` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API keys** > **anon public** key
   - **Project API keys** > **service_role** key (keep this secret!)

## Step 3: Update Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Run Database Migrations

Your database migration is already set up! The contact submissions table will be created automatically when you first use the contact form.

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to your contact form
3. Try submitting a test message
4. Check your Supabase dashboard under **Table Editor** > **contact_submissions** to see if the data was saved

## Step 6: Optional - Set Up Email Notifications

If you want to receive email notifications when someone submits the contact form:

1. Set up an email service (Gmail App Password recommended)
2. Add email configuration to your `.env.local`:

```env
NOTIFICATION_EMAIL=your-email@gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Make sure your `.env.local` file is in the root directory
   - Restart your development server after adding environment variables

2. **"Invalid Supabase URL format"**
   - Ensure your URL starts with `https://` and ends with `.supabase.co`

3. **Database connection errors**
   - Verify your API keys are correct
   - Check that your Supabase project is active

### Verify Your Setup:

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. You should see a `contact_submissions` table after the first form submission

## Security Notes

- Never commit your `.env.local` file to version control
- The `service_role` key has admin privileges - keep it secret
- The `anon` key is safe to use in client-side code
- Consider setting up Row Level Security (RLS) policies for production use

## Next Steps

Once connected, you can:
- View contact form submissions in your Supabase dashboard
- Set up email notifications
- Add admin functionality to manage submissions
- Implement additional features like spam filtering