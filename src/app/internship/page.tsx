import sortArray from "sort-array";
import { MainPanel } from "../_components/layouts";
import { InternEntry, InternshipPeriod, PublicationStore } from "../_lib/types";
import { loadText, loadYAML } from "../_lib/utils";
import { marked } from "marked";
import Image from 'next/image'
import { Metadata } from "next";
import { Collapse, CollapseProps, Flex, Tag } from "antd";
import { LinkWithIcon, SubTitle } from "../_components/typography";
import { VideoReel } from "../_components/VideoReel";
import { PublicationView } from "../_components/PublicationView";
import { BestAwardIcon, HonorableAwardIcon } from "../_components/svg-icons";
import Link from "next/link";
import { Fragment } from "react";

const InternshipPeriodView = (props: {
    period: InternshipPeriod
}) => {
    return <i>{props.period.year_start}.{props.period.month_start} - {props.period.month_end != null ? (props.period.year_end != null ? (props.period.year_start == props.period.year_end ? props.period.month_end : `${props.period.year_end}.${props.period.month_end}`) : `${props.period.month_end}`) : ""}</i>
}

export async function generateMetadata (): Promise<Metadata>{

  const internPageInfo = loadYAML<any>('internship-info.yml')


  const removeMd = require('remove-markdown');
  

  return {
        title: 'Internship@NAVER | Young-Ho Kim',
        description: `${removeMd(internPageInfo['hcigroup'])}\n\n[${internPageInfo['recruitment']['title']}]: ${internPageInfo['open'] == true ? 'Application open.' : 'Application closed.' }`,
        openGraph: {
            title: 'Internship@NAVER | Young-Ho Kim'
        }
    }
}


export default function InternshipPage() {

    const internList = loadYAML<Array<InternEntry>>("interns.yml")


    const internPageInfo = loadYAML<any>("internship-info.yml")

    const isOpen = internPageInfo['open']

    const groupInfo = marked(internPageInfo['hcigroup'], { async: false })
    const recruitmentInfo = {
        title: internPageInfo['recruitment'].title,
        content: marked(internPageInfo['recruitment'].content, { async: false })
    }


    const { store: publicationStore } = loadYAML<{ store: PublicationStore }>("publication.yml")


    const internPublications = sortArray(Object.keys(publicationStore).map(subtitle => publicationStore[subtitle])
        .reduce((prev, curr, i, arr) => {
            return prev.concat(curr)
        }, []).filter(e => {
            return internList.find(intern => {
                const index = intern.publication?.indexOf(e.key || "")
                return index != null && index >= 0
            }) != null
        }), {
        by: ['year', 'month'],
        order: ['desc', 'desc']
    })


    const collapseItems: CollapseProps['items'] = [
        {
            key: '1',
            label: <Flex gap="0 8px" wrap align='center'>
                <span>{recruitmentInfo.title}</span>
                <Tag color={isOpen === true ? "processing" : "error"}>{isOpen === true ? "Open" : "Closed"}</Tag>
            </Flex>,
            children: <div className="markdown-content" dangerouslySetInnerHTML={{ __html: recruitmentInfo.content }} />
        }
    ];


    return <MainPanel withFixedSidebar noSidebar>
        <div className='w-full lg:w-2/3 mb-4'>
            <Image alt="AI Lab HCI group logo" src={"/assets/ai_lab_hci_group_logo.png"} width="461" height="73" />
        </div>
        <div className='markdown-content' dangerouslySetInnerHTML={{ __html: groupInfo }} />
        <SubTitle title="Featured Research" size="small" noTopMargin noLine />
        <VideoReel featuredPublications={internPublications.filter(p => p.featured != null)} className='mb-10' />

        <Collapse items={collapseItems} size='large' />

        <SubTitle title="Present and Past Interns" size={"large"} />
            <p className="text-sm mb-6">*The affiliations are based on the internship period and may not reflect the latest information.</p>
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-6">
                {
                    internList.map(intern => {
                        return <div key={intern.name} className="flex justify-start gap-x-2">
                            <div className='w-24 h-24 aspect-square overflow-hidden rounded-full relative flex-shrink-0'>
                                <Image className="w-full aspect-square" src={`/files/images/portraits/${intern.portrait}`} width={120} height={120} alt={"Portrait of " +intern.name}/>
                            </div>
                            <div className="text-sm">
                                {
                                    intern.link != null ? <LinkWithIcon iconClassName="w-4 h-4" target={"_blank"} label={intern.name} url={intern.link} align={'left'} /> :
                                        <div className='text-[1rem] font-semibold'>{intern.name}</div>
                                }
                                <div className="mt-1.5">{intern.affiliation_full}</div>
                                <div className="intern-period">Internship: {intern.periods.length == 1 ? <InternshipPeriodView period={intern.periods[0]} /> : <span>{intern.periods.map((p, i) => <Fragment key={i}><InternshipPeriodView period={p}/>{i < intern.periods.length - 1 ? <span>, </span> : ""}</Fragment>)}</span>}</div>
                                {
                                    intern.publication != null && intern.publication.length > 0 ? <div className="intern-publication">{"Outcome: "}
                                        {
                                            intern.publication.map((k, i) => <Link href={`publication#${encodeURIComponent(k)}`} key={i}>[{k}] </Link>)
                                        }
                                    </div> : null
                                }
                                {
                                    intern.awards ? <div className='intern-awards'>
                                        {
                                            intern.awards.map((award, i) => {
                                                const isHonorableAward = award.toLowerCase().includes("honorable") === true
                                                return <div key={i} className={`flex ${isHonorableAward ? "text-award-honorable" : "text-award-best"}`}>
                                                    {
                                                        isHonorableAward ? <HonorableAwardIcon className="w-4"/> : <BestAwardIcon className="w-4" />
                                                    }
                                                    <span>{award}</span>
                                                </div>
                                            })
                                        }
                                    </div> : null
                                }
                            </div>
                        </div>
                    })
                }
            </div>

            <SubTitle title="Publication from Internship Projects" size="large"/>
            <div className="publication-list">
                {
                    internPublications.map(e => {
                        return <PublicationView key={e.title} entry={e} />
                    })
                }
            </div>

    </MainPanel>
}