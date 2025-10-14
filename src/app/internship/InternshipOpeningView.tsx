'use client'
import { Collapse, CollapseProps, Flex, Tag } from "antd";
import { InternshipProgramInfo } from "../_lib/types"
import { useEffect, useState } from "react";

export const InternshipOpeningView = ({program}: {
    program: InternshipProgramInfo
}) => {


    const [hash, setHash] = useState<string | undefined>(undefined);

    const [hashIndex, setHashIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash?.substring(1));
        }

        onHashChange()

        window.addEventListener('hashchange', onHashChange)
        window.addEventListener('load', onHashChange)

        return () => {
            window.removeEventListener('hashchange', onHashChange)
            window.removeEventListener('load', onHashChange)
        }
    }, [])

    useEffect(() => {
        if (hash != null) {
            const index = program.openings.findIndex(o => encodeURIComponent(o.title) === hash)
            setHashIndex(index >= 0 ? index : undefined)
        }
    }, [hash, program])

    const collapseItems: CollapseProps['items'] = program.openings.map((opening, i) => 
        ({
            key: i.toString(),
            label: <Flex gap="0 8px" wrap align='center'><div className="anchor-dummy" id={encodeURIComponent(opening.title)}/>
                <span>{opening.title}</span>
                <Tag color={opening.open === true ? "processing" : "error"}>{opening.open === true ? "Open" : "Closed"}</Tag>
            </Flex>,
            children: <div className="markdown-content" dangerouslySetInnerHTML={{ __html: opening.content!! }} />
        }))



    return <Collapse items={collapseItems} activeKey={hashIndex?.toString()} size='large' accordion/>
}
