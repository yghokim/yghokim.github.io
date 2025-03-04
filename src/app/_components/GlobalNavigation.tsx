import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { loadYAML } from '@/app/_lib/utils'
import { RouteAwareLink } from './RouteAwareLink'

const navs = [
    {
        title: "Publication",
        link: "/publication",
        showUpdateDate: true
    },/*
    {
        title: "Research",
        link: "/research"
    },*/
    {
        title: "Internship",
        link: "/internship",
        showInternshipOpen: true
    },
    {
        title: "Resources",
        link: "/resources"
    }
]

const badgeClassName = "absolute text-[8pt] mt-[-3px] bg-amber-500 font-[600] px-1 rounded text-white"

export const GlobalNavigation = (props: {className?: string}) => {

    const { updated } = loadYAML<{updated: string}>('publication.yml')

    const [year, month] = updated.split('-')

    const { open } = loadYAML<{open: boolean}>('internship-info.yml')
    
    return <div className={twMerge(props.className, 'flex-1 flex mb-6 mt-2 lg:gap-x-12 lg:m-0 justify-around lg:justify-start lg:text-[14pt] font-[600] text-black')}>
        <Link href="/" className="link-home">
            <svg className="link-home-icon transition-colors hover:fill-pointed" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        </Link>
        {
            navs.map(nav => {

                let content

                if(nav.showUpdateDate === true && year && month){
                    content = <><div className='nav-title-label'>{nav.title}</div><div className={badgeClassName}>Updated {year}.{month}</div></>
                }else if(nav.showInternshipOpen === true && open != null){
                    content = <><div className='nav-title-label'>{nav.title}</div><div className={badgeClassName}>{open === true ? 'Application Open' : 'Application Closed'}</div></>
                }else{
                    content = nav.title
                }

                return <RouteAwareLink key={nav.title} href={nav.link} pattern={nav.link} matchClassName='overline decoration-dotted decoration-gray-400'>
                    {content}
                </RouteAwareLink>
            })
        }
    </div>
}