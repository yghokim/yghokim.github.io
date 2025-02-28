'use client'

import { MainPanel, Sidebar } from "@/app/_components/layouts"
import { PublicationView } from "@/app/_components/PublicationView"
import { SubTitle } from "@/app/_components/typography"
import { PublicationEntry, PublicationStore, PublicationTimelineData } from "@/app/_lib/types"
import groupArray from "group-array"
import { useParams, usePathname } from 'next/navigation'
import { Fragment, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react"
import sortArray from "sort-array"
import { PublicationTimeline } from "./PublicationTimeline"


type Mode = "year"|"type"

const MODES: Array<Mode> = ["year", "type"]
const MODE_LABELS = {
    "year": "By Year",
    "type": "By Type"
}

const YEAR_SORT_CONFIG = {
    by: ['year', 'type', 'month'], 
    order: ['desc', 'order_type', 'desc'], 
    customOrders: {
        order_type: ['full', 'short', 'ea']
    }
}

interface NormalizedEntries<T>{
    keys: Array<string>,
    entries: {[key: string]: T}
}


export const PublicationPageContent = (props: {
    publicationStore: PublicationStore,
    timelineData: PublicationTimelineData
    sectionSortConfig: any
}
) => {

    const [hash, setHash] = useState<string|undefined>(undefined);

    useEffect(()=>{
        const onHashChange = () => {
            setHash(window.location.hash != null ? window.location.hash.substring(1) : undefined);
          }

          onHashChange()
        
          window.addEventListener('hashchange', onHashChange)
          
          return () => {
            window.removeEventListener('hashchange', onHashChange)
          }
    }, [])

    const [currentMode, setCurrentMode] = useState<Mode>("year")

    const organizedStore : NormalizedEntries<NormalizedEntries<Array<PublicationEntry>>> = useMemo(()=>{
        switch(currentMode){
            case "year":
                const list: Array<PublicationEntry> = []
                Object.keys(props.publicationStore).forEach((type) => {
                    props.publicationStore[type].forEach(p => {
                        list.push(p)
                    })
                })

                sortArray(list, YEAR_SORT_CONFIG)

                const grouped = groupArray(list, ['year', "section"]) as any

                Object.keys(grouped).forEach(year => {
                        grouped[year] = {
                            entries: grouped[year],
                            keys: sortArray(Object.keys(grouped[year]), props.sectionSortConfig)
                        }
                })

                return {
                    keys: sortArray(Object.keys(grouped), {order: 'desc'}),
                    entries: grouped
                }
            case "type":

                const entries: {[key:string]: NormalizedEntries<PublicationEntry>} = {}

                Object.keys(props.publicationStore).forEach(section => {
                    const grouped = groupArray(props.publicationStore[section], ['year'])

                    entries[section] = {
                        entries: grouped as any,
                        keys: sortArray(Object.keys(grouped), {order: 'desc'})
                    }
                })

                return {keys: Object.keys(props.publicationStore), entries}
        }
    } ,[props.publicationStore, props.sectionSortConfig, currentMode])


    const onModeClick: MouseEventHandler<HTMLButtonElement> = useCallback((ev)=>{
        setCurrentMode(ev.currentTarget.id.split("_")[1] as Mode)
    }, [])

    return <>
    <Sidebar fixed>
        <PublicationTimeline data={props.timelineData}/>
    </Sidebar>
    <MainPanel withFixedSidebar>
        {
            organizedStore.keys.map((subtitle, i) => {
                return <div className="publication-sublist" key={i}>
                    <SubTitle title={subtitle} size="large" noTopMargin={i === 0 ? true : undefined} />
                    {
                        organizedStore.entries[subtitle].keys.map((subsubtitle, k) => {
                            return <Fragment key={subsubtitle}>
                                <div className="font-[400] bg-slate-200/70 px-1.5 text-lg mt-6">{subsubtitle}</div>
                                {
                                    organizedStore.entries[subtitle].entries[subsubtitle].map((entry, k) => {
                                        return <PublicationView entry={entry} key={k} showResearchLink={true} showPrimary={true} hashIdToMatch={hash}/>
                                    })
                                }
                            </Fragment>
                        })
                    }
                </div>
            })
        }
    </MainPanel>
    </>   
}