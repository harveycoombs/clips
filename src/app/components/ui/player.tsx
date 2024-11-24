"use client";
import { useState, useRef } from "react";
import { FaExpand, FaPause, FaPlay, FaVolumeHigh } from "react-icons/fa6";

interface Properties {
    url: string;
    classes?: string;
}

export default function Player({ url, classes }: Properties) {
    let [playing, setPlaying] = useState<boolean>(false);

    let seeking = false;

    let seekbarContainer = useRef<HTMLDivElement|null>(null);
    let seekbar = useRef<HTMLDivElement|null>(null);

    function seek(e: any) {
        if (!seekbar?.current || !seekbarContainer?.current || !seeking) return;

        let position = Math.round(e.clientX - seekbarContainer.current.getBoundingClientRect().left);

        seekbar.current.style.width = `${position}px`;
    }

    return (
        <div className="relative bg-slate-50 rounded-lg overflow-hidden aspect-video w-full text-white select-none">
            <div className="bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-0 absolute h-[20%] bottom-0 left-0 right-0"></div>
            <video src={url} className="w-full aspect-video"></video>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 text-xl flex gap-3 items-center" onMouseMove={seek} onMouseUp={() => seeking = false} onMouseLeave={() => seeking = false}>
                <button>{playing ? <FaPause /> : <FaPlay />}</button>
                <button><FaVolumeHigh /></button>
                <div className="text-sm font-semibold">0:00</div>
                <div className="w-full h-2 bg-white bg-opacity-30 rounded-md overflow-hidden cursor-pointer" ref={seekbarContainer} onMouseDown={() => seeking = true}>
                    <div className="h-full bg-blue-500 hover:bg-blue-600" ref={seekbar}></div>
                </div>
                <button><FaExpand /></button>
            </div>
        </div>
    );
}