import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CustomCursor from '@/components/cinematic/CustomCursor';
import DynamicBackground from '@/components/cinematic/DynamicBackground';
import AdminTrigger from '@/components/cinematic/AdminTrigger';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harshil P",
  description: "AI & ML Enthusiast Portfolio",
  // icons is not needed when using icon.tsx convention
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${playfair.variable} ${inter.variable} font-inter antialiased bg-background text-foreground`}>
        <CustomCursor />
        <DynamicBackground />
        <AdminTrigger />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
