export interface NewsArticle {
    year: number,
    month: number,
    headline: string
}

export interface BioEntry {
    from: number,
    to: number | string,
    position: string,
    affiliation: string,
    cv_detail?: {
        organization?: string,
        location?: string,
        role?: string,
        department?: string,
        from_month?: number,
        to_month?: number,
        sub_roles?: Array<{ title: string, from: string, to: string }>
    }
}

export interface BioData {
    contact: {
        email: string,
        website: string,
        github: string,
        scholar: string,
        linkedin?: string,
    },
    research_statement: {
        text: string,
        themes: string[]
    },
    education: Array<{
        degree: string,
        institution: string,
        location: string,
        from: number,
        to: number,
        from_month?: number,
        to_month?: number,
        gpa?: string,
        award?: string,
        honor?: string,
        details?: string[]
    }>,
    employment: Array<BioEntry>
}

export interface CVData {
    grants_awards: Array<{
        year: number,
        to?: number,
        title: string,
        detail: string,
        subdescription?: string
    }>,
    teaching: Array<{
        period: string,
        institution: string,
        location: string,
        role: string,
        courses?: Array<{ code: string, name: string, students?: number }>,
        details?: string[]
    }>,
    service: {
        reviewer: Array<{ venue: string, years?: number[], details?: string }>,
        committee: string[],
        thesis_committee: string[],
        student_volunteer: string[]
    },
    systems: Array<{
        name: string,
        platform: string,
        publication: string | null,
        description: string,
        role: string,
        contributors: string[],
        url?: string,
        used_in?: string[]
    }>,
    mentorship_extra: Array<{
        name: string,
        affiliation: string,
        degree: string,
        topic: string,
        publication?: string[],
        from: string,
        to: string
    }>,
    publication_category_labels: Record<string, string>,
    publication_venue_meta: Record<string, VenueMeta | null>
}

export interface VenueMeta {
    full_name: string,
    acceptance_rate?: string,
    volume_issue?: string,
    presented_at?: string
}

export interface TalkEntry {
    title: string,
    type: string,
    venue: string,
    date: string
}

export interface InternshipProgramInfo {
    hcigroup: string,
    openings: Array<{
        title: string,
        file: string,
        content?: string,
        open?: boolean
    }>
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
    awards?: Array<string>,
    cv_detail?: {
        degree?: string,
        topic?: string
    }
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

export interface PublicationDataFile {
    updated: string
    store: PublicationStore
    affiliation_years: Array<PublicationAffiliationYear>
}

export interface PublicationAffiliationYear {
    affiliation: string
    year_start: number
    year_end: number
}

export interface PublicationStore {
    [key: string]: Array<PublicationEntry>
}


export enum VenueType{
    CHI="CHI",
    CSCW="CSCW",
    UbiComp="UbiComp",
    TVCG="TVCG",
    DIS="DIS"
}


export const SORTED_VENUES = [VenueType.CHI, VenueType.CSCW, VenueType.UbiComp, VenueType.TVCG, VenueType.DIS]

export interface PublicationTimelinePoint{
    publicationKey: string
    venue: string
    venueType: VenueType
    primary: boolean
    award?: string
}

export interface PublicationTimelineData{
    affiliationRowsByYear: {[key: string]: {
        affiliation: string
        rowSpan: number
    }}
    
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