# Personal Portfolio - "Nothing" Inspired

This is a personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. It features a minimalist, "Nothing"-inspired design with glitch effects, smooth animations, and a functional contact form that integrates with Firebase and Resend for email notifications.

## Live Demo

[Link to your live site]

## Features

- **Modern, Minimalist Design**: Inspired by the "Nothing" brand aesthetic, with a dark theme and clean typography.
- **Interactive UI**: Features custom cursors, glitch text effects, and smooth scroll animations.
- **Project Showcase**: A responsive carousel to display your projects with links to GitHub and live demos.
- **Contact Form**: A fully functional contact form that:
  - Saves all messages directly to a **Firestore** database.
  - Sends an email notification for each new message using **Resend**.
- **Responsive Layout**: Looks great on all devices, from mobile phones to desktops.
- **AI Integration Ready**: Built with Genkit for potential future AI features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/) (via Tailwind CSS animations)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Email Service**: [Resend](https://resend.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/erzer12/my-portfolio.git
    cd my-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of your project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Now, open `.env.local` and fill in the required values.

    **a. Firebase Configuration:**
    - Go to your [Firebase Console](https://console.firebase.google.com/).
    - Create a new project or select an existing one.
    - In your **Project Settings** > **General** tab, scroll down to "Your apps".
    - Click the **Web** icon (`</>`) to create a new web app or select your existing one.
    - You will find a `firebaseConfig` object. Copy the corresponding values from this object into your `.env.local` file for each `NEXT_PUBLIC_FIREBASE_*` variable.

    **b. Resend Configuration:**
    - [Sign up for Resend](https://resend.com/) and verify a domain you own.
    - Create an API Key in the Resend dashboard.
    - Add the API key to your `.env.local` file as `RESEND_API_KEY`.
    - In `src/app/actions.ts`, update the `from` and `to` email addresses in the `resend.emails.send` function to match your verified domain and desired recipient.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deployment

This app is ready to be deployed on any platform that supports Next.js, such as:

- **[Vercel](https://vercel.com/):** The easiest way to deploy a Next.js app. Simply connect your GitHub repository.
- **[Firebase App Hosting](https://firebase.google.com/docs/app-hosting):** The `apphosting.yaml` file is already configured.

Remember to set your environment variables (especially `RESEND_API_KEY` and all `NEXT_PUBLIC_FIREBASE_*` keys) in your hosting provider's dashboard.
