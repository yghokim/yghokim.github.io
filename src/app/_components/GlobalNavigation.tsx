import Link from 'next/link'
import path from 'path'
import YAML from 'yaml'
import fs from 'fs-extra'
import { twMerge } from 'tailwind-merge'

const navs = [
    {
        title: "Publication",
        link: "/publication",
        showUpdateDate: true
    },
    {
        title: "Research",
        link: "/research"
    },
    {
        title: "Internship",
        link: "/internship",
        showInternshipOpen: true
    },
    {
        title: "Etc.",
        link: "/fun"
    }
]

const badgeClassName = "absolute text-[8pt] mt-[-3px] bg-amber-500 font-[600] px-1 rounded text-white"

export const GlobalNavigation = (props: {className?: string}) => {

    const publicationFilePath = path.resolve("./private/data", 'publication.yml')
    const { updated } = YAML.parse(fs.readFileSync(publicationFilePath, { encoding: 'utf-8' }))

    const [year, month] = updated.split('-')

    const internshipInfoPath = path.resolve('./private/data/internship-info.yml')
    const { open } = YAML.parse(fs.readFileSync(internshipInfoPath, { encoding: 'utf-8' }))
    
    return <div className={twMerge(props.className, 'flex-1 flex mb-6 mt-2 lg:gap-x-8 lg:m-0 justify-around lg:justify-start lg:text-[14pt] font-[600] text-black')}>
        <Link href="/" className="link-home">
            <svg className="link-home-icon transition-colors hover:fill-pointed" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        </Link>
        {
            navs.map(nav => {

                let content

                if(nav.showUpdateDate === true && year && month){
                    content = <><div className='nav-title-label'>{nav.title}</div><div className={badgeClassName}>Updated {year}.{month}</div></>
                }else if(nav.showInternshipOpen === true && open != null){
                    content = <><div className='nav-title-label'>{nav.title}</div><div className={badgeClassName}>{open === true ? 'Open' : 'Closed'}</div></>
                }else{
                    content = nav.title
                }

                return <Link key={nav.title} href={nav.link}>
                    {content}
                </Link>
            })
        }
    </div>
}