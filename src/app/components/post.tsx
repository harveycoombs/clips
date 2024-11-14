"use client";

import { useRef } from "react";
import Link from "next/link";

import { FaUpRightFromSquare, FaCircleExclamation } from "react-icons/fa6";

export default function Post(props: any) {
    function playVideo(e: any) {
        e.target.play();
    }
    
    function stopVideo(e: any) {
        e.target.pause();
    }

    let post = props.data;

    let hover = useRef<HTMLDivElement>(null);

    return (
        <Link href={`/posts/${post.postid}`} title={post.title} className="group bg-slate-50 aspect-square rounded-md overflow-hidden relative" key={post.postid}>
            <video src={`/uploads/posts/${post.postid}`} className="w-full h-full object-cover z-10 relative" loop muted playsInline onMouseEnter={playVideo} onMouseLeave={stopVideo} onError={(e: any) => {
                e.target.remove();
                hover?.current?.remove();
            }}></video>
            <FaCircleExclamation className="text-6xl absolute inset-0 m-auto text-slate-300/70" />
            <div ref={hover} className="pointer-events-none absolute inset-0 z-20 bg-black text-white bg-opacity-50 place-items-center hidden group-hover:grid"><FaUpRightFromSquare className="text-4xl pointer-events-none" /></div>
        </Link>
    );
}