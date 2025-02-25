import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useRouter } from 'next/router';
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Young-Ho Kim's Personal Website",
  description: "Young-Ho Kim is a research scientist at NAVER AI Lab, leading the Human-Computer Interaction research group.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const router = useRouter()

  useEffect(()=>{
    const handleRouteChange = (url: string) => {
      //TODO Google Analytics
      //googleAnalyticsLogPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <html lang="en">
      <head>
        <title>Young-Ho Kim | HCI Researcher and Builder</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
