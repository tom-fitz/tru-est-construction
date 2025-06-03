import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tru-Est Construction",
  description: "Professional construction services for your home and business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SessionProvider>
          {children}
        </SessionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preserve scroll position during page transitions
              if (typeof window !== 'undefined') {
                let scrollPositions = new Map();
                
                // Save scroll position before navigation
                window.addEventListener('beforeunload', () => {
                  scrollPositions.set(window.location.pathname, window.scrollY);
                });
                
                // Restore scroll position after navigation
                window.addEventListener('load', () => {
                  const savedPosition = scrollPositions.get(window.location.pathname);
                  if (savedPosition !== undefined) {
                    window.scrollTo(0, savedPosition);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
