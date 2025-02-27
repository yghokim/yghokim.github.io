import { HTMLAttributeAnchorTarget } from "react"
import { twMerge } from "tailwind-merge"

export const SubTitle = (props:{
    title: string,
    size: "small" | "large",
    noTopMargin?: boolean,
    noLine?: boolean
    children?: any
}) => {

    return <div className={twMerge("pb-1 mb-1 flex justify-between items-baseline", 
                                props.size === 'large' ? "mt-12" : "mt-8", 
                                props.noTopMargin === true ? "mt-0" : "", 
                                props.noLine === true ? "" : "border-b-[1px] border-gray-300")}>
        <span className={twMerge("font-bold text-gray-500", 
                                props.size === 'large' ? "text-2xl" : "text-xl")}>{props.title}</span>
        {
            props.children
        }
    </div>
}

export const LinkWithIcon = (props: {
    label: string,
    url: string,
    align: "left" | "right",
    target?: HTMLAttributeAnchorTarget,
    className?: string
}) => {
    return <a className={twMerge('flex items-center group', 
        props.align == 'left' ? 'justify-start' : 'justify-end', props.className)} href={props.url} target={props.target || "_blank"} rel="noreferrer">
        <span className="font-semibold text-[12pt] text-ink-light group-hover:text-pointed">{props.label}</span>
        <LinkIcon className="w-5 h-5 fill-ink-light group-hover:fill-pointed"/>
    </a>
}

export const LinkIcon = (props: {className?: string}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" width='24' height='24' className={props.className}>
        <rect fill="none" height="24" width="24" />
        <path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z" />
    </svg>
}