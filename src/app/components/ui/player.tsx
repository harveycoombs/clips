"use client";
import { useState, useRef } from "react";
import { FaExpand, FaPause, FaPlay, FaVolumeHigh } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface Properties {
    url: string;
    classes?: string;
}

export default function Player({ url, classes }: Properties) {
    let [playing, setPlaying] = useState<boolean>(false);
    let [indicatorKey, setIndicatorKey] = useState(0);

    let video = useRef<HTMLVideoElement|null>(null);
    let seekbarContainer = useRef<HTMLDivElement|null>(null);
    let seekbar = useRef<HTMLDivElement|null>(null);
    let elapsedDisplay = useRef<HTMLDivElement|null>(null);

    let seeking = false;

    function seek(e: any) {
        if (!seekbar?.current || !seekbarContainer?.current || !seeking) return;

        let position = Math.round(e.clientX - seekbarContainer.current.getBoundingClientRect().left);

        seekbar.current.style.width = `${position}px`;
    }

    function playVideo() {
        if (!video.current) return;

        if (playing) {
            video.current.pause();
        } else {
            video.current.play();
        }

        setPlaying(!playing);
        setIndicatorKey(prev => prev + 1);
    }

    function updateElapsed(e: any) {
        if (!seekbar?.current || !seekbarContainer?.current || !elapsedDisplay?.current) return;

        let seconds = Math.round(e.target.currentTime);
        let minutes = Math.floor(seconds / 60);

        let percentage = (seconds / e.target.duration) * 100;
        seekbar.current.style.width = `${percentage}%`;

        if (minutes) {
            seconds = (seconds % 60);
        }

        elapsedDisplay.current.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return (
        <div className="relative bg-slate-50 rounded-lg overflow-hidden aspect-video w-full text-white select-none cursor-pointer" onClick={playVideo}>
            <motion.div
                    key={indicatorKey}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                    className="text-4xl absolute inset-0 z-20 w-fit h-fit m-auto"
                >{playing ? <FaPlay /> : <FaPause />}</motion.div>
            <div className="bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-0 absolute h-[20%] bottom-0 left-0 right-0"></div>
            <video src={url} className="w-full aspect-video" ref={video} onTimeUpdate={updateElapsed}></video>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 text-xl flex gap-3 items-center" onMouseMove={seek} onMouseUp={() => seeking = false} onMouseLeave={() => seeking = false}>
                <button>{playing ? <FaPause /> : <FaPlay />}</button>
                <button><FaVolumeHigh /></button>
                <div className="text-sm font-semibold" ref={elapsedDisplay}>0:00</div>
                <div className="w-full h-2 bg-white bg-opacity-30 rounded-md overflow-hidden cursor-pointer" ref={seekbarContainer} onMouseDown={() => seeking = true}>
                    <div className="h-full bg-blue-500 hover:bg-blue-600" ref={seekbar}></div>
                </div>
                <button><FaExpand /></button>
            </div>
        </div>
    );
}