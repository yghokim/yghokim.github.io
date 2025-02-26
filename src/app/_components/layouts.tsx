import { twMerge } from "tailwind-merge"

export const Sidebar = (props: {fixed?: boolean, hideOnMobile?: boolean, children?: any}) => {
    return <div className={twMerge("w-sidebar pl-3 pr-4", props.fixed === true ? 'fixed' : '', props.hideOnMobile !== false ? 'collapse md:visible' : "")}>{props.children}</div>
}

export const MainPanel = (props: {children?: any}) => {
    return <div className="flex-1">{props.children}</div>
}