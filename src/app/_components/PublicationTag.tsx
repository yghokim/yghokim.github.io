import { twMerge } from "tailwind-merge"
import { LinkIcon } from "./typography"

export const LinkTag = (props: {
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

    const tagClass = twMerge("group flex items-center text-white text-sm px-1 py-0 rounded hover:text-white transition-opacity hover:opacity-70 select-none cursor-pointer", 
        bg, 
        (props.showIcon === true ? "text-ink-dark hover:text-ink-dark bg-tag-icon" : ""))

    const content = <><span>{props.label}</span>
    {
        props.showIcon === true ? <LinkIcon className="w-4 h-4 group-hover:fill-ink-dark"/> : null
    }</>

    if (props.onClick != null) {
        return <div className={tagClass} onClick={props.onClick}>
            {content}
        </div>
    } else if (props.url != null) {
        return <div><a className={tagClass} href={props.url} target={props.targetBlank === false ? undefined : "_blank"} rel="noreferrer">
            {content}
        </a></div>
    } else {
        return <div className={tagClass}>
            {content}
            </div>
    }
}