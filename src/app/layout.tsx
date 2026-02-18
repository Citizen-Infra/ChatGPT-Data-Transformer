import type { Metadata } from "next";
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
      <body className="antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
