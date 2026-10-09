import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StellarScope AI",
  description: "The AI-powered on-chain intelligence agent for the Stellar ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
