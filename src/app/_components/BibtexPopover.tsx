'use client'

import React, { useEffect, useState } from "react"
import * as Popover from '@radix-ui/react-popover';
import { LinkTag } from "./PublicationTag";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export const BibTeXPopover = (props: {
    bibtex: string
}) => {

    const [isBibTeXPopoverOpen, setIsBibTeXPopoverOpen] = useState<boolean>(false)
    const [isCopied, setIsCopied] = useState<boolean>(false)

    const [, copyToClipboard] = useCopyToClipboard();

    useEffect(()=>{
        setIsBibTeXPopoverOpen(false)
        setIsCopied(false)
    }, [props.bibtex])

    return <Popover.Root defaultOpen={false} open={isBibTeXPopoverOpen} onOpenChange={(open) => {
        setIsBibTeXPopoverOpen(open)
        if(open === false){
            setIsCopied(false)
        }
    }}>
        <Popover.Trigger asChild>
            <div><LinkTag tag='bibtex' label="BibTeX"/></div>
        </Popover.Trigger>
        <Popover.Portal>
      <Popover.Content className="bg-white p-2 rounded-md border border-gray-300 shadow-lg w-96
    data-[state=open][data-side=top]:animate-slideDownAndFade
    data-[state=open][data-side=right]:animate-slideLeftAndFade
    data-[state=open][data-side=bottom]:animate-slideUpAndFade
    data-[state=open][data-side=left]:animate-slideRightAndFade" sideOffset={8}>
        <div className="flex items-center pb-1">
            <button className="flex items-center px-2 bg-transparent border border-gray-200 rounded" onClick={()=>{
                copyToClipboard(props.bibtex)
                setIsCopied(true)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 -960 960 960" ><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                    <span>Copy</span></button>
            {
                isCopied === true ? <span className="text-sm text-[lightcoral] ml-2">Copied to clipboard.</span> : null
            }
            <div className="flex-1"/>
            <Popover.Close className="popover-close">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </Popover.Close>
        </div>
        <div>
            <textarea disabled className="bg-gray-200 p-2 rounded text-gray-700 w-full resize-none min-h-4 h-40 max-h-40 text-xs font-mono" value={props.bibtex}/>
        </div>
      </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
}