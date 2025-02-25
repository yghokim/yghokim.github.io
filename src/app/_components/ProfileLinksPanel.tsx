import path from 'path';
import fs from 'fs-extra';

const links = [
    {
        title: "Google Scholar",
        url: "https://scholar.google.com/citations?user=UMOierIAAAAJ"
    },
    {
        title: "Github",
        url: "https://github.com/yghokim"
    },
    {
        title: "X (Twitter)",
        url: "https://x.com/YounghoHCI"
    }
]
 
export const ProfileLinks = () => {

    const cvDirectory = path.resolve("./public", 'files/cv')
    const files = fs.readdirSync(cvDirectory)
    files.sort().reverse()
    const cvPath = path.join("files/cv", files[0])

    return <div className="other-links text-[11pt]">
            <div className='flex flex-row sm:flex-col justify-center sm:justify-normal'>
                <div className='flex'>
                {
                    links.map(link => <a className='first:border-none sm:border-l-[1px] border-gray-400 px-2' key={link.title} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)
                }
                </div>
                <a className="link-cv px-2 border-gray-400 sm:border-none font-semibold" href={cvPath} target="_blank" rel="noreferrer">Curriculum Vitae (PDF)</a>
            </div> 
    </div>
}

