import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/chatbot/ChatProvider";
import { FloatingChat } from "@/components/chatbot/FloatingChat";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora - AI Task Management",
  description: "AI-powered task management platform by Sania Sajjad",
  keywords: ["todo", "tasks", "productivity", "ai", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ChatProvider>
            {children}
            <FloatingChat />
          </ChatProvider>
          <Toaster richColors position="top-right" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
