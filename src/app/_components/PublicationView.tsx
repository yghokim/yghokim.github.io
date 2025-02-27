import { useMemo } from "react";
//import { TransitionGallery } from "./TransitionGallery";
//import Image from "next/image";
//import { BibTeXPopover } from "./bibtex";
import { PublicationEntry } from "../_lib/types";
import { BestAwardIcon, HonorableAwardIcon } from "./svg-icons";
import { LinkIcon } from "./typography";
import { twMerge } from "tailwind-merge";

const AUTHOR_MARKS = ["*", "ª"]

enum AwardType{
    Best='best',
    Honorable='honorable',
    Recognition='recognition'
}

export const PublicationView = (props: {
    entry: PublicationEntry,
    showResearchLink?: boolean,
    hashIdToMatch?: string,
    showPrimary?: boolean,
    showThumbnail?: boolean
}) => {

    const showThumbnail = props.showThumbnail !== false && props.entry.thumbnail != null && props.entry.thumbnailProcessed != null

    const componentId = useMemo(()=> props.entry.key != null ? encodeURIComponent(props.entry.key) : undefined, [props.entry.key])

    const showHighlight = props.hashIdToMatch === componentId && componentId != null

    const typeText = useMemo(() => {
        switch (props.entry.type) {
            case "full":
                return "Full Paper"
            case "short":
                return "Short Paper"
            case "article":
                return "Journal Article"
            case "poster":
                return "Poster"
            case "letter":
                return "Letter"
            case "ea":
                return "Extended Abstract"
            case "tutorial":
                return "Tutorial"
            case "workshop":
                return "Workshop"
        }
    }, [props.entry.type])

    const authorMarkDict: {[key:string]: string} | undefined = useMemo(()=>{
        if(props.entry.groups){
            const authorMarkDict: {[key:string]: string} = {}
            props.entry.groups.forEach((g, group_i) => {
                g[0].forEach(name => {
                    authorMarkDict[name] = AUTHOR_MARKS[group_i]
                })
            })
            return authorMarkDict
        }else return undefined
    }, [props.entry.groups])

    const awardType: AwardType | undefined = useMemo(()=>{
        if(props.entry.award != null){
            const labelLower = props.entry.award.toLowerCase()
            if(labelLower.includes("honorable")===true){
                return AwardType.Honorable
            }else if (labelLower.includes("best")===true){
                return AwardType.Best
            }else return AwardType.Recognition
        }else return undefined
    }, [props.entry.award]) 

    const textContent = <>
    {
        props.entry.award != null ? <div className={twMerge('flex gap-x-1 items-center ml-[-3px]', awardType == AwardType.Best ? 'text-award-best' : (awardType == AwardType.Honorable ? 'text-award-honorable' : 'text-award-recognition'))}>
            {
                awardType == AwardType.Honorable ? <HonorableAwardIcon className="w-6 h-6 mb-1"/> : (awardType == AwardType.Best ? <BestAwardIcon className="w-6 h-6 mb-1"/>:null)
            }
            <span className="mb-1">{props.entry.award}</span>
        </div> : null
    }
    <div className="font-[600] text-ink-light relative text-lg leading-6">
        <span className="">{props.entry.title}</span>
        {
            props.entry.primary === true && props.showPrimary === true ? <div className="primary-badge"/> : null
        }
    </div>
    <div className="flex flex-wrap gap-x-1 font-[300] mt-1">
        {
            props.entry.authors.map((author, i) => {
                return <div key={author} className={"author"}>
                    {i === props.entry.authors.length - 1 ? <span>and </span> : ""}
                    <span className={(author === "Young-Ho Kim" ? "underline" : undefined)}>{author}
                    {
                        authorMarkDict != null && authorMarkDict[author] != null ? authorMarkDict[author] : undefined
                    }</span>
                    {i < props.entry.authors.length - 1 ? ", " : ""}
                </div>
            })
        }
        {
            authorMarkDict != null ? <span className="font-light italic">({
                props.entry.groups?.map((group, i) => {
                    return <span key={i}>{AUTHOR_MARKS[i]}{group[1]}{i < props.entry.groups!.length - 1 && props.entry.groups!.length >= 2 ? ", " : ""}</span>
                })
            })</span> : undefined
        }
    </div>
    <div className="flex flex-wrap items-baseline gap-1">
        <div className="mr-1 mt-1">{props.entry.venue} ({typeText}) </div>
        {
            props.entry.doi != null ? <LinkTag label="DOI" tag="doi" url={props.entry.doi} /> : null
        }
        {
            props.entry.pdf != null ? <LinkTag label="PDF" tag="pdf" url={"/files/papers/" + props.entry.pdf} /> : null
        }
        {
            //props.entry.bibtex != null ? <BibTeXPopover bibtex={props.entry.bibtex}/> : null
        }
        {
            props.entry.links != null ? props.entry.links.map(link => <LinkTag key={link.url} label={link.label} url={link.url} />) : null
        }
        {
            (props.entry.research != null && props.showResearchLink !== false) ? <LinkTag
                label="Research Page"
                url={"/research#" + props.entry.research}
                showIcon={true}
                targetBlank={false}
            /> : null
        }
    </div></>

    return <div className={twMerge('mt-7',
                showHighlight === true ? 'bg-highlight outline outline-8 outline-highlight' : '', 
                showThumbnail === true ? 'flex items-start' : '')}>
        <a className="anchor-dummy" id={componentId}/>
        {
            showThumbnail === true ? <><div className="thumbnail-container">
                {
            /*Array.isArray(props.entry.thumbnailProcessed) === true ? <TransitionGallery
                images={props.entry.thumbnailProcessed as Array<IGetPlaiceholderReturn>} interval={2000} /> : <div className="thumbnail-wrapper">
                <Image {...(props.entry.thumbnailProcessed as IGetPlaiceholderReturn).img}
                    blurDataURL={(props.entry.thumbnailProcessed as IGetPlaiceholderReturn).base64}
                    placeholder="blur" fill={true} width={undefined} height={undefined}
                    alt="thumbnail for the research" />
            </div>*/
        }
            </div>
            <div className="text-content-wrapper">
                {textContent}
            </div></> : textContent
        }
        
    </div>
}

const LinkTag = (props: {
    label: string
    tag?: string
    url?: string
    showIcon?: boolean
    targetBlank?: boolean
    onClick?: () => void
}) => {

    let bg : string
    switch(props.tag){
        case 'doi':
            bg = 'bg-tag-doi'
            break;
        case 'bibtex':
            bg = 'bg-tag-bibtex'
            break;
        case 'pdf':
            bg = 'bg-tag-pdf'
            break;
        default:
            bg = 'bg-tag-default'
    }

    const tagClass = twMerge("flex items-center text-white text-sm px-1 py-0 rounded hover:text-white transition-opacity hover:opacity-70", 
        bg, 
        (props.showIcon === true ? "text-ink-dark bg-tag-icon" : ""))

    if (props.onClick != null) {
        return <div className={tagClass} onClick={props.onClick}>
            <span>{props.label}</span>
            {
                props.showIcon === true ? <LinkIcon className="w-4 h-4"/> : null
            }
        </div>
    } else {
        return <div><a className={tagClass} href={props.url} target={props.targetBlank === false ? undefined : "_blank"} rel="noreferrer">
            <span>{props.label}</span>
            {
                props.showIcon === true ? <LinkIcon className="w-4 h-4"/> : null
            }
        </a></div>
    }
}