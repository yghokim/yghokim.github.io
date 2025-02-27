'use client'

import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { PublicationEntry } from "../_lib/types"

export const VideoReel = (props: {
    className?: string
    featuredPublications: Array<PublicationEntry>
}) => {

    const videoElementRef = useRef<HTMLVideoElement>(null)
    const animatedFrameRef = useRef<any>(null)


    const [reelIndex, setReelIndex] = useState(0)
    const [videoCurrentTimeSec, setVideoCurrentTimeSec] = useState(0)
    const [videoDurationSec, setVideoDurationSec] = useState(0)
    
    const onMetadataLoad = ()=>{
        setVideoCurrentTimeSec(0)
        if(videoElementRef.current){
            if(videoElementRef.current.duration > 0){
                setVideoDurationSec(videoElementRef.current.duration)
            }else{
                setVideoDurationSec(0)
            }
        }else{
            console.log("No video element ref")
            setVideoDurationSec(0)
        }
    }

    const paginationBarStyle = useMemo(()=>({
        transform: `translateX(-${(1 - videoCurrentTimeSec/videoDurationSec) * 100}%)`
    }), [videoDurationSec, videoCurrentTimeSec])

    const onTrackEnded = useCallback(()=>{
        setReelIndex((reelIndex + 1) % props.featuredPublications.length)
    }, [props.featuredPublications.length, reelIndex, setReelIndex])

    const onPaginationClick = useCallback<MouseEventHandler<HTMLDivElement>>((ev
    ) => {
        const sp = ev.currentTarget.id.split("-")
        const index = Number.parseInt(sp[sp.length-1])
        if(index != reelIndex) {
            setReelIndex(index)
        }
    }, [reelIndex])

    useEffect(()=>{
        if(videoElementRef.current){
            videoElementRef.current.load()
            videoElementRef.current.play()
        }
    }, [reelIndex])

    useEffect(() => {
        const syncProgress = () => {
          if (videoElementRef.current) {
            setVideoCurrentTimeSec(videoElementRef.current.currentTime)
            setVideoDurationSec(videoElementRef.current.duration)

            animatedFrameRef.current = requestAnimationFrame(syncProgress)
          }
        };
   
        
        if (videoElementRef.current) {
            animatedFrameRef.current = requestAnimationFrame(syncProgress)
        }

        return () => cancelAnimationFrame(animatedFrameRef.current)
      }, []);

    return <div className={props.className}>
        <div className="overflow-hidden rounded-md aspect-video border-2 border-gray-300 relative">
            <video className="w-full m-0 p-0" ref={videoElementRef} muted autoPlay onLoadedMetadata={onMetadataLoad} onEnded={onTrackEnded}>
                <source key={props.featuredPublications[reelIndex].key!} src={`./files/videos/${props.featuredPublications[reelIndex].featured!.video}`} type="video/mp4"/>          
                Your browser does not support the video tag.
            </video>
            <Link className="absolute bottom-0 left-0 right-0 bg-[rgba(13,26,48,0.7)]  p-3" href={`publication#${encodeURIComponent(props.featuredPublications[reelIndex].key!)}`}>
                <div className="pointer-events-none font-[600] mb-0.5 text-[#ffc951]">{props.featuredPublications[reelIndex].venue}</div>
                    <div className="pointer-events-none text-[1.15rem] font-light text-white">{props.featuredPublications[reelIndex].featured?.shorttitle || props.featuredPublications[reelIndex].title}</div>
                    <div className="pointer-events-none mt-1 font-light text-[0.9rem] text-white">{props.featuredPublications[reelIndex].authors.join(", ")}</div>
            </Link>
        </div>
        <div className="flex items-center justify-center mt-4 gap-0.5">
            {
                props.featuredPublications.map((pub, index) => {
                    if(index == reelIndex){
                        return <div key={index} id={`pagination-elm-${index}`} className="pagination-elm active" onClick={onPaginationClick}>
                            <div className="bar"
                                style={paginationBarStyle}
                                />
                        </div>
                    }else{
                        return <div key={index} id={`pagination-elm-${index}`} className="pagination-elm" onClick={onPaginationClick}/>
                    }
                })
            }
        </div>
    </div>
}