import type { Metadata } from "next";
import "./globals.css";
import ChatwootLoader from "./ChatWootLoader";
import { ChatWidget } from "@/components/chat-widget";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "F45 Dashboard - Project Management System",
  description: "Comprehensive dashboard for F45 project management and regional tracking",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className="antialiased">
        <Toaster />

        {/* <Suspense fallback={<div>Loading...</div>}>
            <ChatwootLoader />
            </Suspense> */}

        {children}

        <AuthProvider>
          {/* Custom Chat Widget */}
          <Suspense fallback={<div>Loading...</div>}>
            <ChatWidget />
          </Suspense>
        </AuthProvider>

      </body>
    </html>
  );
}
