import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script"

export const metadata: Metadata = {
  title: "F45 Dashboard - Project Management System",
  description: "Comprehensive dashboard for F45 project management and regional tracking",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className="antialiased">
        <Script id="crisp" strategy="afterInteractive">
          {`
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "367e7c66-9a5b-4673-83ce-8c3a4a8116fe";
            (function(){
              const d=document;
              const s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
          {children}
      </body>
    </html>
  );
}
