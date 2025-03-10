import { PublicationEntry, PublicationTimelineData, SORTED_VENUES, VenueType } from "@/app/_lib/types"
import groupArray from 'group-array';

function extractVenueName(venue: string): VenueType | null {
    if(/^ACM\sCHI\s\d{4}$/g.test(venue)){
        return VenueType.CHI
    }else if(venue.includes("PACM HCI (CSCW")){
        return VenueType.CSCW
    }else if(venue.includes("PACM IMWUT")){
        return VenueType.UbiComp
    }else if(venue.includes("IEEE TVCG")){
        return VenueType.TVCG
    }else return null
}

export function createPublicationTimelineData(entries: Array<PublicationEntry>): PublicationTimelineData | null{
    const filteredPublications = entries.filter(entry => extractVenueName(entry.venue) != null && entry.key != null)
    if(filteredPublications.length > 0){
        const years = filteredPublications.map(e => e.year)
        const startYear = Math.min(...years)
        const endYear = Math.max(...years)
        const publicationByYear: {[key:string]: Array<PublicationEntry>} = groupArray(filteredPublications, ['year']) as any
        
        return {
            startYear,
            endYear,
            yearlyGroups: Object.keys(publicationByYear).reduce((obj, yearString) => {
                const points = publicationByYear[yearString].map(e => ({publicationKey: e.key!, primary: e.primary || false, venue: e.venue, venueType: extractVenueName(e.venue)!}))
                .sort((a, b) => SORTED_VENUES.indexOf(b.venueType) - SORTED_VENUES.indexOf(a.venueType))

                obj[yearString.toString()] = {
                    year: Number.parseInt(yearString),
                    primaryPoints: points.filter(p => p.primary === true),
                    coauthorPoints: points.filter(p => p.primary !== true)
                }

                return obj
            }, {} as any)
        }
    }else{
        return null
    }
}