import type { Metadata } from "next";
import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import TopProgressBar from "@/components/ui/TopProgressBar";
import SplashScreen from "@/components/ui/SplashScreen";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "N&B Italian Hotel | Premium Luxury Hotel",
  description: "Experience the ultimate luxury at N&B Italian Hotel.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`font-sans bg-background text-foreground antialiased`}>
        <CustomCursor />
        <TopProgressBar />
        <QueryProvider>
          <SplashScreen>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </SplashScreen>
        </QueryProvider>
      </body>
    </html>
  );
}