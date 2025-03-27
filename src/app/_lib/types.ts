export interface NewsArticle {
    year: number,
    month: number,
    headline: string
}

export interface BioEntry {
    from: number,
    to: number | string,
    position: string,
    affiliation: string
}

export interface InternshipPeriod {
    year_start: number,
    year_end?: number,
    month_start: number,
    month_end?: number,
}

export interface InternEntry {
    periods: Array<{
        year_start: number,
        year_end?: number,
        month_start: number,
        month_end?: number,
    }>
    affiliation: string,
    affiliation_full: string,
    portrait: string,
    name: string,
    link: string,
    publication?: Array<string>,
    awards?: Array<string>
}

export interface ResearchArea extends ElementWithThumbnail {
    title: string,
    summary: string,
    keywords: Array<string>,
    publications: Array<string>,
    interval?: number,
    disclaimer?: string,
    research?: string
}

export interface CitationCountInfoTable{
    titles: Array<string>,
    citationCounts: Array<number | undefined>,
    citationLinks: Array<string | undefined>,
    fetchedAt: number
}

export interface GoogleScholarInfo{
    totalCitation: number
    hIndex: number
    fetchedAt: number
}

export interface ElementWithThumbnail{
    thumbnail: string | Array<string>
    thumbnailProcessed: any
}

export interface PublicationEntry extends ElementWithThumbnail {
    type: "full" | "short" | "poster" | "article" | "ea" | "letter" | "workshop" | "tutorial"
    section: string
    title: string
    award?: string
    authors: Array<string>
    groups?: Array<[Array<string>, string]>
    venue: string
    key?: string
    selected?: boolean
    primary?: boolean
    doi?: string
    slide?: string
    pdf?: string
    links?: Array<{ label: string, url: string }>
    research?: string,
    year: number,
    month?: number,
    bibtex?: string,
    featured?: {
        video: string
        shorttitle?: string
    } | undefined | null
}

export interface PublicationStore {
    [key: string]: Array<PublicationEntry>
}


export enum VenueType{
    CHI="CHI",
    CSCW="CSCW",
    UbiComp="UbiComp",
    TVCG="TVCG"
}


export const SORTED_VENUES = [VenueType.CHI, VenueType.CSCW, VenueType.UbiComp, VenueType.TVCG]

export interface PublicationTimelinePoint{
    publicationKey: string
    venue: string
    venueType: VenueType
    primary: boolean
}

export interface PublicationTimelineData{
    startYear: number
    endYear: number
    yearlyGroups: {[key: string]: {
        year: number
        primaryPoints: Array<PublicationTimelinePoint>
        coauthorPoints: Array<PublicationTimelinePoint>
    }}
}

export interface ResearchEntry {
    key: string
    title: string
    members: Array<string>
    keywords?: Array<string>
    publications?: Array<PublicationEntry>
    links?: Array<{ label: string, url: string }>
    summary: string
}

export interface FunProjectEntry { title: string, content: Array<any> }

export interface FunProjectStore {
    overview: { __html: string },
    projects: Array<FunProjectEntry>
}

export interface PressEntry { date: string, title: string, press: string, url: string }