import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stellarscope-ai.vercel.app"),

  title: {
    default: "StellarScope AI",
    template: "%s | StellarScope AI",
  },

  description:
    "The AI-powered on-chain intelligence agent for the Stellar ecosystem",

  keywords: [
    "StellarScope AI",
    "Stellar",
    "Blockchain",
    "On-chain Intelligence",
    "AI Agent",
    "Soroban",
    "XLM",
    "Crypto Analytics",
    "On-chain Data",
    "Web3",
    "AI Chat",
  ],

  applicationName: "StellarScope AI",

  authors: [
    {
      name: "StellarScope AI",
      url: "https://github.com/stellarscope-ai/stellarscope-ai",
    },
  ],

  creator: "StellarScope AI",
  publisher: "StellarScope AI",
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
    title: "StellarScope AI",
    description:
      "The AI-powered on-chain intelligence agent for the Stellar ecosystem",
    url: "https://stellarscope-ai.vercel.app",
    siteName: "StellarScope AI",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "StellarScope AI",
    description:
      "The AI-powered on-chain intelligence agent for the Stellar ecosystem",
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
