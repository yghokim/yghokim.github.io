import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import { ProfileLinks } from "./_components/ProfileLinksPanel";
import { GlobalNavigation } from "./_components/GlobalNavigation";

const mainFont = Source_Sans_3({
  variable: "--font-source-sans",
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

  return (
    <html lang="en">
      <head>
        <title>Young-Ho Kim | HCI Researcher and Builder</title>
      </head>
      <body
        className={`${mainFont.className} antialiased`}
      >
        <div className="min-h-[100vh] flex flex-col content-center items-center">
          <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 shadow-md">
          <div className="container mx-auto flex flex-col lg:flex-row lg:items-center">
            <Link href="/"><div className="ml-3 flex items-center justify-center py-1 lg:py-2 lg:flex-col lg:items-start gap-3 lg:gap-0 lg:w-sidebar">
                    <div className="lg:text-2xl font-semibold lg:font-[700]">Young-Ho Kim, PhD</div>
                    <div className="text-md font-normal lg:font-[600]">HCI Researcher &amp; Builder</div>
                </div></Link>
            <div className="flex flex-1 flex-col items-stretch sm:flex-row sm:items-center">
              <GlobalNavigation className="order-2 sm:order-1"/>
              <ProfileLinks className="order-1 sm:order-2"/>
            </div>
          </div>
          </header>
          <main>
          {children}
          </main>
          <footer>

          </footer>
        </div>
      </body>
    </html>
  );
}
