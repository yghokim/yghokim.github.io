'use client'

import { MainPanel, Sidebar } from "@/app/_components/layouts"
import { PublicationView } from "@/app/_components/PublicationView"
import { SubTitle } from "@/app/_components/typography"
import { PublicationEntry, PublicationStore, PublicationTimelineData } from "@/app/_lib/types"
import groupArray from "group-array"
import { Fragment, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react"
import sortArray from "sort-array"
import { PublicationTimeline } from "./PublicationTimeline"
import { Segmented } from 'antd';


type Mode = "year" | "type"

const MODES: Array<{label: string, value: Mode}> = [{label: 'By Year', value: "year"}, {label: 'By Type', value: "type"}]

const YEAR_SORT_CONFIG = {
    by: ['year', 'month'],
    order: ['desc', 'order_type', 'desc'],
    customOrders: {
        order_type: ['full', 'short', 'ea']
    }
}

interface NormalizedEntries<T> {
    keys: Array<string>,
    entries: { [key: string]: T }
}


export const PublicationPageContent = (props: {
    publicationStore: PublicationStore,
    timelineData: PublicationTimelineData
    sectionSortConfig: any
}
) => {

    const [hash, setHash] = useState<string | undefined>(undefined);

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash?.substring(1));
        }

        onHashChange()

        window.addEventListener('hashchange', onHashChange)
        window.addEventListener('load', onHashChange)

        return () => {
            window.removeEventListener('hashchange', onHashChange)
            window.removeEventListener('load', onHashChange)
        }
    }, [])

    const [currentMode, setCurrentMode] = useState<Mode>("year")

    const organizedStore: NormalizedEntries<NormalizedEntries<Array<PublicationEntry>>> = useMemo(() => {
        switch (currentMode) {
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
                    keys: sortArray(Object.keys(grouped), { order: 'desc' }),
                    entries: grouped
                }
            case "type":

                const entries: { [key: string]: NormalizedEntries<PublicationEntry> } = {}

                Object.keys(props.publicationStore).forEach(section => {
                    const grouped = groupArray(props.publicationStore[section], ['year'])

                    entries[section] = {
                        entries: grouped as any,
                        keys: sortArray(Object.keys(grouped), { order: 'desc' })
                    }
                })

                return { keys: Object.keys(props.publicationStore), entries }
        }
    }, [props.publicationStore, props.sectionSortConfig, currentMode])


    const onModeClick = useCallback((mode: Mode) => {
        setCurrentMode(mode)
    }, [])

    return <>
        <Sidebar fixed>
            <Segmented options={MODES} onChange={onModeClick} size={'middle'}/>
            <div className="mt-4">
                <span className="text-badge-primary text-xl">●</span>: First/corresponding author
            </div>
            <PublicationTimeline className="mt-8" data={props.timelineData} onHighlightPaper={(id: string) => {
                setHash(encodeURIComponent(id));
            }}/>
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
                                            return <PublicationView entry={entry} key={k} showResearchLink={true} showPrimary={true} hashIdToMatch={hash} />
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