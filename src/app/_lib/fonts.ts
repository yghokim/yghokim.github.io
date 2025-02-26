import { Noto_Sans_KR } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";

export const koreanFont = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ['400', '700']
});


export const mainFont = Source_Sans_3({
    subsets: ["latin"],
});