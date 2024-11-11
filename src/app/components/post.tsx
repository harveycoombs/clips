"use client";

import Link from "next/link";

import { FaUpRightFromSquare } from "react-icons/fa6";

export default function Post(props: any) {
    function playVideo(e: any) {
        e.target.play();
    }
    
    function stopVideo(e: any) {
        e.target.pause();
    }

    let post = props.data;

    return (
        <Link href={`/posts/${post.postid}`} title={post.title} className="group bg-slate-50 aspect-square rounded-md overflow-hidden relative" key={post.postid}>
            <video src={`/uploads/posts/${post.postid}`} className="w-full h-full object-cover" loop muted playsInline onMouseEnter={playVideo} onMouseLeave={stopVideo}></video>
            <div className="pointer-events-none absolute inset-0 bg-black text-white bg-opacity-50 place-items-center hidden group-hover:grid"><FaUpRightFromSquare className="text-4xl pointer-events-none" /></div>
        </Link>
    );
}