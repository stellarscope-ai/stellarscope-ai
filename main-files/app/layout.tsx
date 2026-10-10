import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),

  title: {
    default: "Orbit – AI SaaS Starter UI Kit for Next.js & shadcn/ui",
    template: "%s | Orbit",
  },

  description:
    "Orbit is a modern AI SaaS Starter UI Kit built with Next.js, React, TypeScript, Tailwind CSS and shadcn/ui. Includes AI Chat, Dashboard, Authentication, Billing, Team, Profile, Knowledge Base, Landing Pages and reusable UI components for building modern SaaS applications.",

  keywords: [
    "Orbit",
    "AI SaaS UI Kit",
    "AI SaaS Starter Kit",
    "Next.js",
    "Next.js UI Kit",
    "Next.js Dashboard",
    "React",
    "React Dashboard",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Admin Dashboard",
    "Dashboard UI",
    "Dashboard Template",
    "AI Dashboard",
    "AI Chat",
    "Authentication",
    "Billing",
    "Profile",
    "Team Management",
    "Knowledge Base",
    "Landing Page",
    "SaaS UI",
    "UI Kit",
    "Admin Template",
    "Responsive Dashboard",
    "Dark Mode",
    "Modern Dashboard",
    "Developer UI Kit",
    "Codervent",
  ],

  applicationName: "Orbit",

  authors: [
    {
      name: "Codervent",
      url: "https://codervent.com",
    },
  ],

  creator: "Codervent",
  publisher: "Codervent",
  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Orbit – AI SaaS Starter UI Kit for Next.js & shadcn/ui",
    description:
      "Modern AI SaaS Starter UI Kit built with Next.js, React, Tailwind CSS and shadcn/ui.",
    url: "https://your-domain.com",
    siteName: "Orbit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orbit - AI SaaS Starter UI Kit",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Orbit – AI SaaS Starter UI Kit",
    description:
      "Modern AI SaaS Starter UI Kit built with Next.js, React, Tailwind CSS and shadcn/ui.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/orbit-ai/favicon.ico",
    shortcut: "/orbit-ai/favicon.ico",
    apple: "/orbit-ai/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
          {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}