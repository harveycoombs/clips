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
    let [indicatorIsVisible, setIndicatorVisibility] = useState(true);
    let [indicatorKey, setIndicatorKey] = useState(0);

    let video = useRef<HTMLVideoElement|null>(null);
    let seekbarContainer = useRef<HTMLDivElement|null>(null);
    let seekbar = useRef<HTMLDivElement|null>(null);

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
        setIndicatorVisibility(true);
        setIndicatorKey(prev => prev + 1);
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
                    onAnimationComplete={() => setIndicatorVisibility(false)}
                    className="text-4xl absolute inset-0 z-20 w-fit h-fit m-auto"
                >{playing ? <FaPause /> : <FaPlay />}</motion.div>
            <div className="bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-0 absolute h-[20%] bottom-0 left-0 right-0"></div>
            <video src={url} className="w-full aspect-video" ref={video}></video>
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