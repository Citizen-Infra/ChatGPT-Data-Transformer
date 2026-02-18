import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Data Transformer — chatgpt.pdt.com",
  description:
    "Switching to Claude? Take your ChatGPT data with you. Processed entirely in your browser. No account. No storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-sans overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
