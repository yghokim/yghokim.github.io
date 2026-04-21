'use client'

import { BioData, CVData, TalkEntry } from '@/app/_lib/types'
import { MergedAward, CVPublicationCategory } from '../_lib/cv-utils'
import { MainPanel } from '@/app/_components/layouts'
import '../cv-print.css'

const MY_NAME = 'Young-Ho Kim'

// Section heading: matches the site's SubTitle style on the web
// (font-bold text-gray-500, gray-300 bottom border). The `body.pdf-mode`
// overrides in cv-print.css switch this to the traditional CV look
// (font-light text-cv-heading) during PDF generation.
function CVSection({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
    return <section className={`cv-section mt-10 first:mt-6 ${className ?? ''}`.trim()}>
        <h2 className="cv-section-heading text-2xl font-bold text-gray-500 border-b border-gray-300 pb-1 mb-4">{title}</h2>
        {children}
    </section>
}

function CVSubSection({ title }: { title: string }) {
    return <h3 className="cv-subsection-heading text-lg font-bold text-ink-dark mt-5 mb-2">{title}</h3>
}

function AuthorList({ authors, className }: { authors: string[], className?: string }) {
    return <span className={className}>{authors.map((author, i) => {
        const cleanName = author.replace(/^\+/, '')
        const isMe = cleanName === MY_NAME
        return <span key={i}>
            {i > 0 && ', '}
            {isMe ? <span className="underline underline-offset-2">{cleanName}</span> : cleanName}
        </span>
    })}</span>
}

function PublicationRef({ pubKey, labelMap }: { pubKey: string, labelMap: Record<string, string> }) {
    const label = labelMap[pubKey]
    if (!label) return <span>[{pubKey}]</span>
    return <a href={`#pub-${pubKey}`} className="text-blue-700 hover:underline">[{label}]</a>
}

function PublicationRefs({ keys, labelMap }: { keys?: string[], labelMap: Record<string, string> }) {
    if (!keys || keys.length === 0) return null
    return <>{keys.map((key, i) => <span key={key}>{i > 0 && ' '}<PublicationRef pubKey={key} labelMap={labelMap} /></span>)}</>
}

interface CVPageContentProps {
    bio: BioData
    cv: CVData
    talks: TalkEntry[]
    awards: MergedAward[]
    categories: CVPublicationCategory[]
    mentorship: Array<{
        name: string
        affiliation: string
        degree: string
        topic: string
        publications: string
        from: string
        to: string
    }>
    labelMap: Record<string, string>
    pdfDateStamp: string
}

export function CVPageContent({ bio, cv, talks, awards, categories, mentorship, labelMap, pdfDateStamp }: CVPageContentProps) {
    return <MainPanel withFixedSidebar noSidebar>
        <div className="cv-root text-ink-dark text-[11pt] leading-relaxed">
        {/* Web-only: Download PDF button at top */}
        <div className="web-only cv-no-print mb-6 flex justify-end items-center gap-3">
            <span className="text-sm text-gray-600 italic">
                Full details are available in the PDF.
            </span>
            <a href="/files/cv/younghokim_cv.pdf" download={`younghokim_cv_${pdfDateStamp}.pdf`} target="_blank" rel="noreferrer"
                className="inline-block px-4 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-800 transition-colors shrink-0">
                Download PDF
            </a>
        </div>

        {/* PDF-only: Name / title / contact header */}
        <div className="cv-header mb-6 pdf-only">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold">{MY_NAME}</h1>
                    <div className="text-gray-600 mt-1">Lead Research Scientist</div>
                    <div className="text-gray-600">NAVER AI Lab</div>
                </div>
                <div className="text-right text-sm text-gray-600 space-y-0.5">
                    <div>{bio.contact.email}</div>
                    <div><a href={bio.contact.website} className="text-blue-700 hover:underline">{bio.contact.website}</a></div>
                    <div><a href={bio.contact.github} className="text-blue-700 hover:underline">{bio.contact.github}</a></div>
                    <div>Google Scholar (<a href={bio.contact.scholar} className="text-blue-700 hover:underline">Link</a>)</div>
                </div>
            </div>
        </div>

        {/* Research Statement */}
        <CVSection title="Research Statement" className="pdf-only">
            <p className="text-[10.5pt] leading-relaxed">{bio.research_statement.text}</p>
            <div className="flex gap-3 mt-3">
                {bio.research_statement.themes.map(theme =>
                    <span key={theme} className="border border-gray-400 px-3 py-1 text-sm">{theme}</span>
                )}
            </div>
        </CVSection>

        {/* Employment */}
        <CVSection title="Employment">
            {bio.employment.filter(e => e.cv_detail).map((entry, i) => {
                const d = entry.cv_detail!
                return <div key={i} className="cv-entry flex gap-4 mb-4">
                    <div className="w-[120px] shrink-0 italic text-sm">
                        {d.from_month ? `${monthName(d.from_month)} ${entry.from}` : entry.from} –<br />
                        {entry.to === 'Now' ? <em>Present</em> : (d.to_month ? `${monthName(d.to_month)} ${entry.to}` : entry.to)}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold">{d.organization || entry.affiliation}{d.location && `, ${d.location}`}</div>
                        {d.role && <div className="italic">{d.role}</div>}
                        {d.department && <div className="italic">{d.department}</div>}
                        {d.sub_roles && d.sub_roles.map((role, j) =>
                            <div key={j} className="text-sm">{role.title} ({role.from} – <em>{role.to}</em>)</div>
                        )}
                    </div>
                </div>
            })}
            {/* I-UM entry without cv_detail sub_roles */}
            {bio.employment.filter(e => e.cv_detail && !e.cv_detail.sub_roles && e.cv_detail.role).map((entry, i) => null)}
        </CVSection>

        {/* Education */}
        <CVSection title="Education">
            {bio.education.map((edu, i) =>
                <div key={i} className="cv-entry flex gap-4 mb-4">
                    <div className="w-[120px] shrink-0 italic text-sm">
                        {edu.from_month ? `${monthName(edu.from_month)} ${edu.from}` : `${edu.from}`} –<br />
                        {edu.to_month ? `${monthName(edu.to_month)} ${edu.to}` : `${edu.to}`}
                    </div>
                    <div className="flex-1">
                        <div>
                            <span className="font-bold">{edu.degree}</span>
                            {edu.honor && <span> [{edu.honor}]</span>}
                            {edu.award && <span> [<em>{edu.award}</em>]</span>}
                            {edu.gpa && <span> (GPA: {edu.gpa})</span>}
                        </div>
                        <div>{edu.institution}, {edu.location}</div>
                        {edu.details && <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                            {edu.details.map((d, j) => <li key={j} dangerouslySetInnerHTML={{ __html: d.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />)}
                        </ul>}
                    </div>
                </div>
            )}
        </CVSection>

        {/* Grants, Awards, and Recognitions */}
        <CVSection title="Grants, Awards, and Recognitions">
            {awards.map((award, i) =>
                <div key={i} className="cv-entry flex gap-4 mb-2">
                    <div className="w-[80px] shrink-0 italic text-sm">
                        {award.to ? `${award.year}–${award.to}` : award.year}
                    </div>
                    <div className="flex-1">
                        <span className="font-bold">{award.title}</span>
                        {'—'}{award.publicationLabel && <span className="pdf-only">[<a href={`#pub-${award.publicationKey}`} className="text-blue-700 hover:underline">{award.publicationLabel}</a>] </span>}{award.detail}
                        {award.subdescription && <div className="text-sm mt-0.5">{award.subdescription}</div>}
                    </div>
                </div>
            )}
        </CVSection>

        {/* Publication */}
        <CVSection title="Publication" className="pdf-only">
            <p className="italic text-sm mb-4">
                – Papers marked with ● indicate those for which I served as the primary author (either first or corresponding).
            </p>
            {categories.map(cat =>
                <div key={cat.prefix} className="mb-6">
                    <CVSubSection title={cat.label} />
                    {cat.publications.map(pub =>
                        <div key={pub.key || pub.title} id={pub.key ? `pub-${pub.key}` : undefined}
                            className="cv-pub-entry flex gap-2 mb-4">
                            <div className="w-[42px] shrink-0 text-left">
                                <div className="font-semibold text-sm">[{pub.cvLabel}]</div>
                                {pub.primary && <div>●</div>}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">{pub.title}</div>
                                {pub.award && <div className="text-orange-600 font-semibold text-sm">[{pub.award}]{pub.award.toLowerCase().includes('best paper') && !pub.award.toLowerCase().includes('honorable') ? ' (top 1% of submissions)' : pub.award.toLowerCase().includes('honorable') ? ' (top 5% of submissions)' : ''}</div>}
                                <AuthorList authors={pub.authors} className="text-sm" />
                                <div className="italic text-sm whitespace-pre-line">
                                    {pub.cvVenue}
                                </div>
                                {(pub.doi || pub.links) && <div className="text-sm cv-no-print">
                                    Links: {pub.doi && <a href={pub.doi} className="text-blue-700 hover:underline mr-2">DOI</a>}
                                    {pub.links?.map((link, j) =>
                                        <a key={j} href={link.url} className="text-blue-700 hover:underline mr-2">{link.label}</a>
                                    )}
                                </div>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </CVSection>

        {/* Computing Systems as Research Artifacts */}
        <CVSection title="Computing Systems as Research Artifacts">
            {cv.systems.map((sys, i) =>
                <div key={i} className="cv-entry mb-4">
                    <div className="font-bold">
                        {sys.name} ({sys.platform})
                        {sys.publication && <span className="pdf-only"> – Artifact for <PublicationRef pubKey={sys.publication} labelMap={labelMap} /></span>}
                    </div>
                    <div className="italic text-sm">{sys.description}</div>
                    <ul className="text-sm list-disc list-inside mt-1 space-y-0.5">
                        <li>Role: {sys.role}</li>
                        <li>Contributors: <AuthorList authors={sys.contributors} /></li>
                    </ul>
                    {sys.url && <div className="text-sm">
                        Open-sourced (<a href={sys.url} className="text-blue-700 hover:underline">{sys.url}</a>)
                    </div>}
                </div>
            )}
        </CVSection>

        {/* Teaching Experience */}
        <CVSection title="Teaching Experience">
            {cv.teaching.map((entry, i) =>
                <div key={i} className="cv-entry flex gap-4 mb-4">
                    <div className="w-[100px] shrink-0 italic text-sm">{entry.period}</div>
                    <div className="flex-1">
                        <div className="font-bold">{entry.institution}, {entry.location}</div>
                        <div className="italic">{entry.role}</div>
                        {entry.courses?.map((course, j) =>
                            <div key={j} className="text-sm">
                                ■ {course.code}: {course.name}
                                {course.students && `, ${course.students} students`}
                            </div>
                        )}
                        {entry.details && <ul className="text-sm list-disc list-inside mt-1 space-y-0.5">
                            {entry.details.map((d, j) => <li key={j}>{d}</li>)}
                        </ul>}
                    </div>
                </div>
            )}
        </CVSection>

        {/* Student Mentorship & Collaboration */}
        <CVSection title="Student Mentorship & Collaboration" className="pdf-only">
            {mentorship.map((m, i) =>
                <div key={i} className="cv-entry flex justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <div>
                            <span className="font-bold">{m.name},</span> {m.affiliation} {m.degree}
                        </div>
                        <div className="text-sm">{m.topic}</div>
                    </div>
                    <div className="text-right text-sm shrink-0 italic">
                        <div>{m.affiliation.includes('University of Maryland') || m.affiliation.includes('Seoul National') ? m.affiliation : 'NAVER AI Lab'}</div>
                        <div>{m.from} – {m.to}</div>
                    </div>
                </div>
            )}
        </CVSection>

        {/* Talks & Panels */}
        <CVSection title="Talks & Panels">
            {talks.map((talk, i) =>
                <div key={i} className="cv-entry flex justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <div className="font-bold">{talk.title}</div>
                        <div className="text-sm">{talk.type}</div>
                    </div>
                    <div className="text-right text-sm shrink-0 italic">
                        <div>{talk.venue}</div>
                        <div>{talk.date}</div>
                    </div>
                </div>
            )}
        </CVSection>

        {/* Service (closing root div after final section) */}
        <CVSection title="Service">
            <div className="cv-entry flex gap-4 mb-4">
                <div className="w-[120px] shrink-0 font-bold">Reviewer</div>
                <div className="flex-1">
                    {cv.service.reviewer.map((r, i) =>
                        <div key={i} className="text-sm">
                            {r.venue} ({r.years ? r.years.join(', ') : r.details})
                        </div>
                    )}
                </div>
            </div>
            <div className="cv-entry flex gap-4 mb-4">
                <div className="w-[120px] shrink-0 font-bold">Committee</div>
                <div className="flex-1">
                    {cv.service.committee.map((c, i) => <div key={i} className="text-sm">{c}</div>)}
                </div>
            </div>
            <div className="cv-entry flex gap-4 mb-4">
                <div className="w-[120px] shrink-0 font-bold">Thesis Committee</div>
                <div className="flex-1">
                    {cv.service.thesis_committee.map((t, i) => <div key={i} className="text-sm">{t}</div>)}
                </div>
            </div>
            <div className="cv-entry flex gap-4 mb-4">
                <div className="w-[120px] shrink-0 font-bold">Student Volunteer</div>
                <div className="flex-1">
                    {cv.service.student_volunteer.map((s, i) => <div key={i} className="text-sm">{s}</div>)}
                </div>
            </div>
        </CVSection>
        </div>
    </MainPanel>
}

function monthName(month: number): string {
    const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return names[month] || ''
}
