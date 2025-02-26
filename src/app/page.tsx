import Image from "next/image";
import profilePic from '../../public/assets/younghokim-portrait-2023.jpg';
import { MainPanel, Sidebar } from "./_components/layouts";
import { BioEntry, InternEntry, InternshipPeriod } from "./_lib/types";
import { LinkWithIcon, SubTitle } from "./_components/typography";
import { loadYAML } from "./_lib/utils";



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

export default function Page() {




  return (
    <>
      <Sidebar>
        <Image src={profilePic} alt="Photo of Young-Ho Kim" 
          className="rounded-full"/>
        <BioView side={true}/>
        <InternsView side={true}/>
      </Sidebar>
      <MainPanel>
        hoho
      </MainPanel>
    </>
  );
}
