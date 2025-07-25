import type { Metadata } from "next";
import "./globals.css";
import ChatwootLoader from "./ChatWootLoader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "F45 Dashboard - Project Management System",
  description: "Comprehensive dashboard for F45 project management and regional tracking",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className="antialiased">

        <Suspense fallback={<div>Loading...</div>}>
          <ChatwootLoader />
        </Suspense>

        {children}
      </body>
    </html>
  );
}
