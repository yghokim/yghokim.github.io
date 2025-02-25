import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import { ProfileLinks } from "./_components/ProfileLinksPanel";

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
          <div className="container mx-auto sm:flex sm:items-center">
            <Link href="/"><div className="ml-3 flex items-center justify-center py-1 sm:py-2 sm:flex-col sm:items-start gap-3 sm:gap-0">
                    <div className="sm:text-2xl font-semibold sm:font-[700]">Young-Ho Kim, PhD</div>
                    <div className="text-md font-normal sm:font-[600]">HCI Researcher &amp; Builder</div>
                </div></Link>
            <ProfileLinks/>
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
