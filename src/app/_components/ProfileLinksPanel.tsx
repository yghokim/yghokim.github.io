import path from 'path';
import fs from 'fs-extra';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

const links = [
    {
        title: <Image className='group-hover:opacity-70' src="/assets/googlescholar-icon.png" alt="Google Scholar" width={19} height={19} />,
        alt: 'Google Scholar',
        url: "https://scholar.google.com/citations?user=UMOierIAAAAJ"
    },
    {
        title: <Image className='group-hover:opacity-70' src="/assets/github-mark.png" alt="Github" width={19} height={19} />,
        alt: 'Github',
        url: "https://github.com/yghokim"
    },
    {
        title: <Image className='group-hover:opacity-70' src="/assets/linkedin.png" alt="LinkedIn" width={18} height={18} />,
        alt: 'LinkedIn',
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

    return <div className={twMerge(props.className, "text-[11pt] flex items-center justify-evenly sm:justify-normal")}>
                {
                    links.map((link, i) => <a className='group px-2' key={i.toString()} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)
                }
                <a className="link-cv px-2 font-semibold" href={cvPath} target="_blank" rel="noreferrer">CV</a>
    </div>
}

