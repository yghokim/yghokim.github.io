import { twMerge } from "tailwind-merge"

export const Sidebar = (props: {fixed?: boolean, children?: any}) => {
    const content = <div className={twMerge("w-sidebar pl-3 pr-8 hidden md:inline", props.fixed === true ? 'fixed' : '')}>{props.children}</div>

    if(props.fixed === true){
        return <div>{content}</div>
    }else{
        return content
    }
}

export const MainPanel = (props: {withFixedSidebar?: boolean, children?: any}) => {
    return <div className={twMerge("flex-1 px-3 md:px-0", props.withFixedSidebar === true ? 'ml-0 md:ml-sidebar': '')}>{props.children}</div>
}