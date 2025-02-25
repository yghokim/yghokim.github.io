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
    return <div className="other-links">
            {
                links.map(link => <a key={link.title} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)
            }
        <a className="link-cv font-semibold" href={""} target="_blank" rel="noreferrer">Curriculum Vitae (PDF)</a>
    </div>
}

