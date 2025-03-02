import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import "./globals.css";
import Link from 'next/link'
import { ProfileLinks } from "./_components/ProfileLinksPanel";
import { GlobalNavigation } from "./_components/GlobalNavigation";
import { mainFont } from "./_lib/fonts";


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://younghokim.net")
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${mainFont.className}`}
      ><AntdRegistry>
          <div className="min-h-[100vh] flex flex-col content-center items-center">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 shadow-md">
            <div className="lg:container lg:mx-auto flex flex-col lg:flex-row lg:items-center">
              <Link href="/">
                <div className="pl-0 lg:pl-3 flex items-center border-b-[1px] lg:border-none self-stretch lg:self-auto justify-center py-1 lg:py-2 lg:flex-col lg:items-start gap-3 lg:gap-0 lg:w-sidebar">
                  <div className="lg:text-2xl font-semibold lg:font-[700]">Young-Ho Kim, PhD</div>
                  <div className="text-md font-normal lg:font-[600]">HCI Researcher &amp; Builder</div>
                </div>
              </Link>
              <div className="flex flex-1 flex-col items-stretch sm:flex-row sm:items-center sm:pr-4 lg:pr-3">
                <GlobalNavigation className="order-2 sm:order-1"/>
                <ProfileLinks className="order-1 sm:order-2 border-b-[1px] py-1 sm:border-none sm:py-0"/>
              </div>
            </div>
            </header>
            <div className="container mx-auto flex-1 sm:flex sm:flex-row content-start self-stretch items-center sm:items-start pt-32 sm:pt-28 lg:pt-28 pb-10">
              {children}
            </div>
            <footer className="w-full p-2 border border-t-[1px] border-[#eaeaea] flex justify-center items-center text-sm text-ink-light">
              Copyright © 2021-2025 Young-Ho Kim. All Rights Reserved. The website was designed by Young-Ho Kim and built with React and Next.js.
            </footer>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
