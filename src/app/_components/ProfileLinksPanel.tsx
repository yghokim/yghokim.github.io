import path from 'path';
import fs from 'fs-extra';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

const links = [
    {
        title: "Google Scholar",
        url: "https://scholar.google.com/citations?user=UMOierIAAAAJ"
    },
    {
        title: <Image className='group-hover:opacity-70' src="/assets/github-mark.png" alt="Github" width={19} height={19} />,
        url: "https://github.com/yghokim"
    },
    {
        title: <Image className='group-hover:opacity-70' src="/assets/linkedin.png" alt="LinkedIn" width={18} height={18} />,
        url: "https://www.linkedin.com/in/younghokim-hci/"
    }
]
 
export const ProfileLinks = (props: {
    className?: string
}) => {

    const cvDirectory = path.resolve("./public", 'files/cv')
    const files = fs.readdirSync(cvDirectory)
    files.sort().reverse()
    const cvPath = path.join("files/cv", files[0])

    return <div className={twMerge(props.className, "text-[11pt]")}>
            <div className='flex flex-row sm:flex-col justify-center sm:justify-normal'>
                <div className='flex'>
                {
                    links.map((link, i) => <a className='group first:border-none sm:border-l-[1px] border-gray-400 px-2' key={i.toString()} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)
                }
                </div>
                <a className="link-cv px-2 border-gray-400 sm:border-none font-semibold" href={cvPath} target="_blank" rel="noreferrer">Curriculum Vitae</a>
            </div> 
    </div>
}

