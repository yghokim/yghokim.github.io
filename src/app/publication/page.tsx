import { Metadata } from "next";
import { loadYAML } from "../_lib/utils";
import { PublicationDataFile } from "../_lib/types";
import { createPublicationTimelineData } from "./_libs/common";
import { PublicationPageContent } from "./_components/PublicationPageContent";


export const metadata: Metadata = {
    title: 'Publication | Young-Ho Kim'
}

export default function PublicationPage() {


    const { store, affiliation_years } = loadYAML<PublicationDataFile>("publication.yml")
    
    for(const section of Object.keys(store)){
        store[section].forEach(paper => {
            paper.section = section
        })
    }

    const timelineData = createPublicationTimelineData( Object.keys(store).reduce((prev, curr, index) => prev.concat(store[curr] as any), []), affiliation_years)!
    const sortConfig = {
        order: ['order_section'],
        customOrders: {
            order_section: Object.keys(store)
        }
    }


    return <PublicationPageContent publicationStore={store} timelineData={timelineData} sectionSortConfig={sortConfig}/>
}