import Image from "next/image";
import profilePic from '../../public/assets/younghokim-portrait-2023.jpg';
import { MainPanel, Sidebar } from "./_components/layouts";
import { BioEntry, InternEntry, InternshipPeriod, NewsArticle, PressEntry, PublicationStore } from "./_lib/types";
import { LinkWithIcon, SubTitle } from "./_components/typography";
import { loadText, loadYAML } from "./_lib/utils";
import { useMemo } from "react";
import { format, parse } from "date-fns"
import { marked } from 'marked'
import sortArray from 'sort-array'
import { PaperDiagram } from "./_components/PaperDiagram";
import { VideoReel } from "./_components/VideoReel";
import { koreanFont } from "./_lib/fonts";
import { PublicationView } from "./_components/PublicationView";
import removeMd from 'remove-markdown';

const BioView = (props: {side: boolean, className?: string | undefined}) => {

  const bioList = loadYAML<Array<BioEntry>>("bio.yml")


  return <div className={props.className}><SubTitle title="Short bio" size={props.side === true ? "small" : "large"} />
  <div className="main-list">
    {
      bioList.map(bioEntry => {
        return <div className="main-list-element" key={bioEntry.position + "|" + bioEntry.affiliation}>
          <div className="w-[30%] font-semibold">{bioEntry.from} - {bioEntry.to}</div>
          <div className="w-1/3">{bioEntry.position}</div>
          <div className="">{bioEntry.affiliation}</div>
        </div>
      })
    }
  </div></div>
}

const InternPeriodView = (props: {period: InternshipPeriod}) => {
  return <span>{props.period.year_start}.{props.period.month_start} - {props.period.month_end != null ? (props.period.year_end != null ? (props.period.year_start == props.period.year_end ? props.period.month_end : `${props.period.year_end}.${props.period.month_end}`) : `${props.period.month_end}`) : ""}</span>
}

const InternsView = (props: {side: boolean, className?: string | undefined}) => {

  const internList: Array<InternEntry> = loadYAML<Array<InternEntry>>("interns.yml")

  return <div className={props.className}><SubTitle title="Research interns" size={props.side ? "small" : "large"}>
  <LinkWithIcon className="text-sm" target={"_self"} label="More" url="/internship" align={'left'} />
</SubTitle>
  <div className="main-list">
    {
      internList.map((internEntry, i) => {
        return <div className="main-list-element" key={i}>
          <div className="w-[27%] font-semibold">{internEntry.periods.length == 1 ? <InternPeriodView period={internEntry.periods[0]}/> : internEntry.periods.sort((a,b)=>b.year_start - a.year_start).map((p, i) => <div key={i}><InternPeriodView period={p}/></div>)}</div>
          <div className="w-[36%] underline underline-offset-2">{
            internEntry.link != null ? <a href={internEntry.link} target="_blank" rel="noreferrer">{internEntry.name}</a> : <div>{internEntry.name}</div>
            }</div>
          <div className="affiliation">{internEntry.affiliation}</div>
        </div>
      })
    }
  </div></div>
}
const NewsView = (props: {side: boolean, className?: string | undefined}) => {

  const news = loadYAML<Array<NewsArticle>>("news.yml")
  return <div className={props.className}><SubTitle title="News" size={props.side ? "small" : "large"} />
  <div className="main-list !gap-2">
    {
      news.map((article, index) => {
        return<div key={index} className="main-list-element md:text-[0.95rem]">
            <div className="font-semibold w-[15%] md:w-[22%]">
                {article.year + "." + article.month}
            </div>
            <div className="flex-1">
                {article.headline}
            </div>
        </div>
      })
    }
  </div></div>
}

const PressArticle = (props: {
  article: PressEntry
}) => {

  const newsDateFormatted = useMemo(()=>{
      return format(parse(props.article.date, "yyyy-MM-dd", new Date()), "yyyy.M")
  }, [props.article.date])

  return <div className={`main-list-element text-sm ${koreanFont.className}`}>
      <div className="font-semibold w-[15%] md:w-[22%]">{newsDateFormatted}</div>
      <div className="flex-1">
          <a className="md:text-sm" href={props.article.url} rel="noreferrer" target="_blank">{props.article.title}</a>
          <div className="md:text-xs font-bold mt-1">{props.article.press}</div>
      </div>
      
  </div>
}

const PressView = (props: {side: boolean, className?: string | undefined}) => {

  const pressEntryList: Array<PressEntry> = loadYAML("press.yml")

  return <div className={props.className}><SubTitle title="Press" size={props.side ? "small" : "large"} />
  <div className={"main-list !gap-3"}>
    {
      pressEntryList.map((article, index) => {
        return <PressArticle key={index} article={article}/>
      })
    }
  </div></div>
}



export async function generateMetadata (){

  const introductionMarkdownText = loadText("og-desc.md")

  return {
    title: "Young-Ho Kim: HCI researcher & builder",
    description: removeMd(introductionMarkdownText),
    openGraph: {
      title: "Young-Ho Kim: HCI researcher & builder",

    }
  }
}

export default function Page() {

  const introductionMarkdownText = {__html: marked(loadText("intro.md"))}

  const { store: publicationStore } = loadYAML<{ store: PublicationStore }>("publication.yml")

  const selectedPublication = sortArray(Object.keys(publicationStore).map(subtitle => publicationStore[subtitle])
    .reduce((prev, curr) => {
      return prev.concat(curr)
    }, []).filter(e => e.selected === true), {
    by: ['year', 'month'],
    order: ['desc', 'desc']
  })

  return (
    <>
      <Sidebar>
        <Image src={profilePic} alt="Photo of Young-Ho Kim" placeholder="blur"
          className="rounded-full"/>
        <BioView side={true}/>
        <InternsView side={true}/>
        <NewsView side={true}/>
        <PressView side={true}/>
      </Sidebar>
      <MainPanel>
        <div className="markdown-content" dangerouslySetInnerHTML={introductionMarkdownText}/>

        <BioView side={false} className='md:hidden'/>

        <SubTitle title="Research Area" size="large" />
        {
          <PaperDiagram publications={selectedPublication}/>
        }


        <SubTitle title="Selected Publication" size="large" noLine={true}>
          <LinkWithIcon url='/publication' label="All Publication" align="right" target={"_self"} />
        </SubTitle>

        <VideoReel featuredPublications={selectedPublication.filter(p => p.featured != null)} className={'mb-12'}/>

        <div className="publication-list">
          {
            selectedPublication.map(e => {
              return <PublicationView key={e.title} entry={e} />
            })
          }
        </div>


        <InternsView side={false} className='md:hidden'/>
        <NewsView side={false} className='md:hidden'/>
        <PressView side={false} className="md:hidden"/>

      </MainPanel>
    </>
  );
}
