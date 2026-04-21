import { Metadata } from 'next'
import { loadYAML } from '@/app/_lib/utils'
import { BioData, CVData, InternEntry, PublicationDataFile, TalkEntry } from '@/app/_lib/types'
import { buildCVPublications, buildMergedAwards, buildMentorshipList } from './_lib/cv-utils'
import { CVPageContent } from './_components/CVPageContent'

export const metadata: Metadata = {
    title: 'CV | Young-Ho Kim'
}

export default function CVPage() {
    const bioData = loadYAML<BioData>('bio.yml')
    const cvData = loadYAML<CVData>('cv.yml')
    const talks = loadYAML<TalkEntry[]>('talks.yml')
    const interns = loadYAML<InternEntry[]>('interns.yml')

    const { store } = loadYAML<PublicationDataFile>('publication.yml')

    // Stamp sections onto publications
    for (const section of Object.keys(store)) {
        store[section].forEach(paper => {
            paper.section = section
        })
    }

    // Build CV publication data
    const { categories, labelMap } = buildCVPublications(
        store,
        cvData.publication_category_labels,
        cvData.publication_venue_meta
    )

    // Build merged awards
    const awards = buildMergedAwards(categories, cvData.grants_awards, labelMap)

    // Build mentorship list
    const mentorship = buildMentorshipList(interns, cvData.mentorship_extra, labelMap)

    // Build-time date stamp used for the suggested PDF download filename.
    // Baked in at static export time; matches the PDF footer's generated date.
    const pdfDateStamp = new Date().toISOString().slice(0, 10)

    return <CVPageContent
        bio={bioData}
        cv={cvData}
        talks={talks}
        awards={awards}
        categories={categories}
        mentorship={mentorship}
        labelMap={Object.fromEntries(labelMap)}
        pdfDateStamp={pdfDateStamp}
    />
}
