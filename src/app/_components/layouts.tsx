import { twMerge } from "tailwind-merge"

export const Sidebar = (props: {fixed?: boolean, children?: any}) => {
    return <div className={twMerge("w-sidebar pl-3 pr-8 hidden md:inline", props.fixed === true ? 'fixed' : '')}>{props.children}</div>
}

export const MainPanel = (props: {withFixedSidebar?: boolean, children?: any}) => {
    return <div className={twMerge("flex-1 px-3 md:px-0", props.withFixedSidebar === true ? 'ml-0 md:ml-sidebar': '')}>{props.children}</div>
}