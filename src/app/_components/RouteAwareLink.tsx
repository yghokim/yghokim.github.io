'use client'

import Link, {LinkProps} from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export const RouteAwareLink = (props: {
    pattern: string,
    className?: string,
    matchClassName? : string
    children?: any
} & LinkProps) => {
    const path = usePathname()

    const className = useMemo(()=>{
        const match = path.match(props.pattern)
        if(match){
            return twMerge(props.className, props.matchClassName)
        }else return props.className
    }, [props.pattern, path, props.className, props.matchClassName])

    return <Link {...props} className={className}>{props.children}</Link>
}