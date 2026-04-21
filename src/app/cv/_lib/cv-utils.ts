import { PublicationEntry, PublicationStore, CVData, InternEntry, VenueMeta } from '@/app/_lib/types'

const SECTION_TO_CATEGORY: Record<string, string | ((type: string) => string)> = {
    'Peer-reviewed Conferences and Journals': (type: string) => type === 'article' ? 'J' : 'C',
    'Lightly Peer-reviewed Extended Abstracts': () => 'W',
    'Organized Workshops and Tutorials': () => 'O',
}

export interface CVPublication extends PublicationEntry {
    cvCategory: string
    cvNumber: number
    cvLabel: string
    cvVenue: string // formatted venue string for CV display
    acceptanceRate?: string | null
}

export interface CVPublicationCategory {
    prefix: string
    label: string
    publications: CVPublication[]
}

/**
 * Build categorized publication lists with CV labels (e.g., [J1], [C26])
 * from the publication store.
 */
export function buildCVPublications(
    store: PublicationStore,
    categoryLabels: Record<string, string>,
    venueMeta: Record<string, VenueMeta | null>
): {
    categories: CVPublicationCategory[]
    labelMap: Map<string, string>
} {
    // 1. Categorize all publications
    const grouped: Record<string, CVPublication[]> = { J: [], C: [], W: [], O: [] }

    for (const section of Object.keys(store)) {
        const resolver = SECTION_TO_CATEGORY[section]
        if (!resolver) continue // skip "Archived Preprints" etc.

        for (const pub of store[section]) {
            const category = typeof resolver === 'function' ? resolver(pub.type) : resolver
            if (!grouped[category]) continue

            // Find venue meta and format CV venue string
            const meta = findVenueMeta(pub.venue, venueMeta)
            const cvVenue = formatCVVenue(pub.venue, meta)
            const acceptanceRate = meta?.acceptance_rate || null

            grouped[category].push({
                ...pub,
                section: section,
                cvCategory: category,
                cvNumber: 0, // assigned below
                cvLabel: '', // assigned below
                cvVenue,
                acceptanceRate,
            })
        }
    }

    // 2. Sort each group by year desc, month desc, and assign numbers
    const labelMap = new Map<string, string>()
    const categoryOrder = ['J', 'C', 'W', 'O']
    const categories: CVPublicationCategory[] = []

    for (const prefix of categoryOrder) {
        const pubs = grouped[prefix]
        if (!pubs || pubs.length === 0) continue

        pubs.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year // oldest first = lowest number
            return (a.month ?? 0) - (b.month ?? 0)
        })

        // Assign numbers: 1 = oldest, N = most recent (CV convention)
        pubs.forEach((pub, i) => {
            pub.cvNumber = i + 1
            pub.cvLabel = `${prefix}${i + 1}`
        })

        // Reverse for display (most recent first)
        pubs.reverse()

        // Build label map
        for (const pub of pubs) {
            if (pub.key) {
                labelMap.set(pub.key, pub.cvLabel)
            }
        }

        categories.push({
            prefix,
            label: categoryLabels[prefix] || prefix,
            publications: pubs,
        })
    }

    return { categories, labelMap }
}

/**
 * Find the best matching venue meta for a publication's venue string.
 * Matches by exact string inclusion, longest match wins.
 */
function findVenueMeta(
    venue: string,
    venueMeta: Record<string, VenueMeta | null>
): VenueMeta | null {
    let bestMatch: VenueMeta | null = null
    let bestLength = 0
    for (const [key, meta] of Object.entries(venueMeta)) {
        if (venue.includes(key) && key.length > bestLength && meta) {
            bestMatch = meta
            bestLength = key.length
        }
    }
    return bestMatch
}

/**
 * Format the full CV venue string from venue meta + original venue name.
 * The original venue name from publication.yml (e.g., "ACM CHI 2025") is used
 * as the short identifier in parentheses.
 *
 * Examples:
 *   "Proc. ACM CHI Conference on Human Factors in Computing Systems (ACM CHI 2025, 25.1% Acceptance Rate)."
 *   "PACM on Human-Computer Interaction (PACMHCI), 8 (PACM HCI (CSCW 2024)), 2024."
 */
function formatCVVenue(venue: string, meta: VenueMeta | null): string {
    if (!meta) return venue + '.'

    let result = meta.full_name

    // Only add original venue in parentheses if it adds information
    // Skip if full_name already contains venue, or venue already contains full_name
    // (e.g., venue="Schizophrenia Bulletin Open (Oct 2022)" contains full_name="Schizophrenia Bulletin Open")
    const venueAddsInfo = !meta.full_name.includes(venue) && !venue.includes(meta.full_name)

    const parens: string[] = []
    if (venueAddsInfo) parens.push(venue)
    if (meta.acceptance_rate) parens.push(`${meta.acceptance_rate} Acceptance Rate`)
    if (parens.length > 0) {
        result += ` (${parens.join(', ')})`
    }

    // Add volume/issue if present (for PACM journals)
    if (meta.volume_issue) {
        result += `, ${meta.volume_issue}`
    }

    result += '.'

    // Add "Also presented at" if applicable
    if (meta.presented_at) {
        result += `\nAlso presented at ${meta.presented_at}.`
    }

    return result
}

export interface MergedAward {
    year: number
    to?: number
    title: string
    detail: string
    subdescription?: string
    publicationLabel?: string
    publicationKey?: string
}

/**
 * Merge paper awards from publications with freeform awards from cv.yml,
 * sorted by year descending.
 */
export function buildMergedAwards(
    categories: CVPublicationCategory[],
    freeformAwards: CVData['grants_awards'],
    labelMap: Map<string, string>
): MergedAward[] {
    const awards: MergedAward[] = []

    // Extract paper awards from publications
    for (const cat of categories) {
        for (const pub of cat.publications) {
            if (!pub.award) continue

            // Determine primary/co-author note
            const authorNote = pub.primary ? '(Corresponding-authored)' : '(Co-authored)'

            // Extract short venue from venue string (e.g., "ACM CHI 2025")
            const venueShort = extractShortVenue(pub.venue, pub.year)

            awards.push({
                year: pub.year,
                title: pub.award,
                // NOTE: publicationLabel is intentionally kept separate from detail
                // so it can be rendered as a pdf-only span (hidden on web since the
                // Publication section doesn't exist there).
                detail: `${venueShort}. ${authorNote}`,
                publicationLabel: pub.cvLabel,
                publicationKey: pub.key,
            })
        }
    }

    // Add freeform awards
    for (const award of freeformAwards) {
        awards.push({ ...award })
    }

    // Sort by year descending
    awards.sort((a, b) => b.year - a.year)

    return awards
}

function extractShortVenue(venue: string, year: number): string {
    // Try to extract conference name like "ACM CHI 2025" or "ACM ISS 2022"
    const match = venue.match(/(?:ACM|IEEE|EAI)?\s*([A-Z][A-Za-z@]+(?:'?\d{2})?)/)?.[0]
    if (match) {
        // Check if year is already in the match
        if (match.includes(String(year)) || match.includes("'" + String(year).slice(2))) {
            return match
        }
        return `${match} ${year}`
    }
    return venue
}

/**
 * Resolve a publication key to its CV label and anchor.
 */
export function resolvePublicationRef(
    key: string,
    labelMap: Map<string, string>
): { label: string; anchor: string } | null {
    const label = labelMap.get(key)
    if (!label) return null
    return { label: `[${label}]`, anchor: `#pub-${key}` }
}

/**
 * Resolve multiple publication keys to their CV labels.
 */
export function resolvePublicationRefs(
    keys: string[] | undefined,
    labelMap: Map<string, string>
): string {
    if (!keys || keys.length === 0) return ''
    return keys
        .map(key => resolvePublicationRef(key, labelMap))
        .filter((ref): ref is { label: string; anchor: string } => ref !== null)
        .map(ref => ref.label)
        .join(' ')
}

/**
 * Build intern mentorship data for the CV, combining interns.yml and mentorship_extra.
 */
export function buildMentorshipList(
    interns: InternEntry[],
    extraMentees: CVData['mentorship_extra'],
    labelMap: Map<string, string>
): Array<{
    name: string
    affiliation: string
    degree: string
    topic: string
    publications: string
    from: string
    to: string
}> {
    const list: Array<{
        name: string
        affiliation: string
        degree: string
        topic: string
        publications: string
        from: string
        to: string
        sortYear: number
        sortMonth: number
    }> = []

    // From interns.yml
    for (const intern of interns) {
        if (!intern.cv_detail) continue
        const latestPeriod = intern.periods.sort((a, b) => b.year_start - a.year_start)[0]
        const earliestPeriod = intern.periods.sort((a, b) => a.year_start - b.year_start)[0]

        const fromStr = formatPeriod(earliestPeriod.month_start, earliestPeriod.year_start)
        const toStr = latestPeriod.month_end
            ? formatPeriod(latestPeriod.month_end, latestPeriod.year_end ?? latestPeriod.year_start)
            : 'Present'

        let topic = intern.cv_detail.topic || ''
        const pubRefs = resolvePublicationRefs(intern.publication, labelMap)
        if (pubRefs) {
            topic += ` Coauthored ${pubRefs}.`
        }

        list.push({
            name: intern.name,
            affiliation: intern.affiliation_full,
            degree: intern.cv_detail.degree || '',
            topic,
            publications: pubRefs,
            from: fromStr,
            to: toStr,
            sortYear: latestPeriod.year_start,
            sortMonth: latestPeriod.month_start,
        })
    }

    // From mentorship_extra
    for (const mentee of extraMentees) {
        let topic = mentee.topic
        const pubRefs = resolvePublicationRefs(mentee.publication, labelMap)
        if (pubRefs) {
            topic += ` Coauthored ${pubRefs}.`
        }

        // Parse from date for sorting
        const fromMatch = mentee.from.match(/(\w+)\s+(\d{4})/)
        const sortYear = fromMatch ? parseInt(fromMatch[2]) : 0
        const sortMonth = fromMatch ? monthToNum(fromMatch[1]) : 0

        list.push({
            name: mentee.name,
            affiliation: mentee.affiliation,
            degree: mentee.degree,
            topic,
            publications: pubRefs,
            from: mentee.from,
            to: mentee.to,
            sortYear,
            sortMonth,
        })
    }

    // Sort by start date descending
    list.sort((a, b) => {
        if (a.sortYear !== b.sortYear) return b.sortYear - a.sortYear
        return b.sortMonth - a.sortMonth
    })

    return list
}

function formatPeriod(month: number, year: number): string {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[month] || month} ${year}`
}

function monthToNum(month: string): number {
    const months: Record<string, number> = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    }
    return months[month] || 0
}
