import { memo, useMemo } from "react";
import { Tooltip } from 'antd';
import { PublicationTimelineData, PublicationTimelinePoint, SORTED_VENUES } from "../../_lib/types"
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StarIcon, TrophyIcon } from '@heroicons/react/16/solid';


const VENUE_COLORS = ["#fb50a3", "#09A4DB", "#A45CB9", "#FEC606", "#018F9C"]

const VenueLegend = () => {
    return <div className="mt-1 mb-0.5">
        <div className="flex flex-wrap gap-2.5 my-1 mt-2">
        {
            SORTED_VENUES.map(venue => <div className="flex gap-x-1 items-center" key={venue}>
                <div className="block w-3.5 h-3.5 rounded-sm" style={{background: VENUE_COLORS[SORTED_VENUES.indexOf(venue)]}}/>
                <span className="text-sm">{venue}</span>
                </div>)
        }
        </div>
    </div>
}

const AwardLegend = () => {
    return <div className="mt-2 mb-3">
        <div className="flex flex-wrap gap-2.5 my-1 mt-2">
            <div className="flex gap-x-1 items-center">
                <TrophyIcon className="w-4 h-4 text-gray-500"/>
                <span className="text-sm">Best Paper Award</span>
            </div>
            <div className="flex gap-x-1 items-center">
                <StarIcon className="w-3.5 h-3.5 text-gray-500"/>
                <span className="text-sm">Honorable Mention</span>
            </div>
        </div>
    </div>
}

const PublicationItem = memo((props: {
    point: PublicationTimelinePoint,
    onClickCapture: () => void
}) => {
    const awardType = props.point.award != null ? 
        (props.point.award.toLowerCase().includes("honorable") ? "honorable" : 
         props.point.award.toLowerCase().includes("best") ? "best" : undefined) 
        : undefined;

    return <Tooltip key={props.point.publicationKey} title={
        <div>
            <div>{props.point.publicationKey}</div>
            {props.point.award && (
                <div className="text-yellow-500 flex items-center gap-1">
                    {awardType === "best" ? (
                        <TrophyIcon className="w-3.5 h-3.5 text-yellow-500"/>
                    ) : awardType === "honorable" ? (
                        <StarIcon className="w-3.5 h-3.5 text-yellow-500"/>
                    ) : null}
                    {props.point.award}
                </div>
            )}
        </div>
    }>
            <Link href={`publication#${encodeURIComponent(props.point.publicationKey)}`} replace onClickCapture={props.onClickCapture}>
                <div className="relative">
                    <div
                        className="block w-[13pt] rounded aspect-square cursor-pointer hover:opacity-70 transition-opacity"
                        style={{background: VENUE_COLORS[SORTED_VENUES.indexOf(props.point.venueType)]}}/>
                    {props.point.award != null && awardType != null && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {awardType === "best" ? (
                                <TrophyIcon className="w-3.5 h-3.5 text-white"/>
                            ) : (
                                <StarIcon className="w-3 h-3 text-white"/>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </Tooltip>
})

PublicationItem.displayName = "PublicationItem"

const unitContainerClass = "flex items-center gap-0.5";
const primaryClass = "flex-row-reverse";
const coauthorClass = "flex-row justify-start";

export const PublicationTimeline = (props: {
    data: PublicationTimelineData
    className?: string
    onHighlightPaper?: (id: string) => void
}) => {

    const years = useMemo(()=>{
        return Array.from(Array(props.data.endYear - props.data.startYear + 1).keys()).map(x => x + props.data.startYear).reverse()
    }, [props.data.startYear, props.data.endYear])

    return <div className={props.className}>
        <span className="font-bold">Publication at top venues by year</span>

        <VenueLegend/>
        <AwardLegend/>
        <table>
            <thead>
                <tr>
                    <th className="text-sm text-right">Primary-authored</th>
                    <td></td>
                    <th className="text-sm text-left">Co-authored</th>
                </tr>
            </thead>
            <tbody>
            {
                years.map(year => {
                    return <tr key={year}>
                        <td valign="middle">
                            <div className={twMerge(unitContainerClass, primaryClass)}>{props.data.yearlyGroups[year.toString()]?.primaryPoints?.map(p => {
                            return <PublicationItem key={p.publicationKey} point={p} onClickCapture={() => {props.onHighlightPaper?.(p.publicationKey)}}/>
                        })}</div></td>
                        <td valign="middle" className="text-sm font-[500] text-ink-dark px-1">{year}</td>
                        <td valign="middle">
                            <div className={twMerge(unitContainerClass, coauthorClass)}>{props.data.yearlyGroups[year.toString()]?.coauthorPoints?.map(p => {
                            return <PublicationItem key={p.publicationKey} point={p} onClickCapture={() => {props.onHighlightPaper?.(p.publicationKey)}}/>
                        })}</div></td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}