'use client'

import {PublicationEntry} from '../_lib/types';
import { ReactSVG } from 'react-svg';

export const PaperDiagram = (props: {
    publications: Array<PublicationEntry>
}) => {

    return <div className="max-w-[680px] mx-auto my-8"><ReactSVG
    src={'./assets/personal-research-agenda-overview.svg'}
    beforeInjection={(svg) => {
        svg.classList.add('paper-diagram')
        const publicationChildren = svg.querySelector('g#publication')?.children
        if(publicationChildren != null){
            for(let itemIndex = 0; itemIndex < publicationChildren.length; itemIndex++){
                const item = publicationChildren.item(itemIndex)!
                if(item.tagName == 'text'){
                    const content = item.textContent!.trim()
                    const key = content.substring(1, content.length - 1)
                    const publication = props.publications.find(p => p.key === key)
                    if(publication != null){
                        const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
                        link.setAttributeNS(null, 'href', `publication#${encodeURIComponent(key)}`);
                        item.parentNode?.replaceChild(link, item)
                        link.appendChild(item)
                    }
                }
            }
        }

        //const previousResearchGroup = svg.querySelector('g#previous-research')
        //const recentResearchGroup = svg.querySelector('g#recent-research')
    }}
    /></div>
}