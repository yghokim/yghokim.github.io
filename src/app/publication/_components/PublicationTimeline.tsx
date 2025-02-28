import { memo, useMemo } from "react";
import { Tooltip } from 'antd';
import { PublicationTimelineData, PublicationTimelinePoint, SORTED_VENUES } from "../../_lib/types"
import Link from "next/link";
import { twMerge } from "tailwind-merge";


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

const PublicationItem = memo((props: {
    point: PublicationTimelinePoint,
    onClickCapture: () => void
}) => {
    return <Tooltip key={props.point.publicationKey} title={props.point.publicationKey}>
            <Link href={`publication#${encodeURIComponent(props.point.publicationKey)}`} replace onClickCapture={props.onClickCapture}>
                <div
                    className="block w-3.5 aspect-square cursor-pointer hover:opacity-70 transition-opacity"
                    style={{background: VENUE_COLORS[SORTED_VENUES.indexOf(props.point.venueType)]}}/>
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
        <table>
            <thead>
                <tr>
                    <th className="text-sm">Primary-authored</th>
                    <td></td>
                    <th className="text-sm">Co-authored</th>
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