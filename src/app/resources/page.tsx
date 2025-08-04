import { marked } from "marked";
import { MainPanel, Sidebar } from "../_components/layouts";
import { SubTitle } from "../_components/typography";
import { loadText } from "../_lib/utils";
import Link from "next/link";
import Image from 'next/image'
import { Metadata } from "next";

export const metadata: Metadata  = {
    title: 'Resources | Young-Ho Kim'
}

export default function ResourcesPage(){

    const bio = marked(loadText('presenter-bio.md'))

    return <>
        <MainPanel withFixedSidebar>
            <SubTitle title="Latest Bio for Seminars" size="large" noTopMargin/>
            <div className="markdown-content mt-4 bg-slate-100 p-2 px-4 rounded-xl" dangerouslySetInnerHTML={{__html: bio}}/>
            <Link href="/assets/younghokim-portrait-2025.jpg" className="block mt-4">
                <Image src="/assets/younghokim-portrait-2025.jpg" width={900} height={900} alt="Portrait of Young-Ho Kim" className="w-1/4 min-w-[200px]"/>
                <div>Click to download image</div>
            </Link>
            
            <SubTitle title="Logos for Presentation and Media" size="large"/>
        </MainPanel>
    </>
}