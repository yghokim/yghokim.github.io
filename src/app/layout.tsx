import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Link from 'next/link'

const sourceSans = Source_Sans_3({
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
        className={`${sourceSans.variable} antialiased`}
      >
        <div className="min-h-[100vh] flex flex-col content-center items-center">
          <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 shadow-md">
          <div className="container mx-auto">
            <Link href="/"><div className="ml-3 flex items-center sm:block">
                    <div className="text-lg font-[700]">Young-Ho Kim, PhD</div>
                    <div className="text-sm font-[600]">HCI Researcher &amp; Builder</div>
                </div></Link>
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
