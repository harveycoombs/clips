"use client";

import { useRef } from "react";
import Link from "next/link";

import { FaUpRightFromSquare, FaCircleExclamation } from "react-icons/fa6";

export default function Post(props: any) {
    let hover = useRef<HTMLDivElement>(null);

    let post = props.data;

    return (
        <Link href={`/posts/${post.postid}`} title={post.title} className="group bg-slate-50 aspect-16/10 rounded-lg overflow-hidden relative" key={post.postid}>
            <img className="w-full h-full object-cover" src={`/uploads/thumbnails/${post.postid}`} />
            <div ref={hover} className="pointer-events-none absolute inset-0 z-20 bg-black text-white bg-opacity-50 place-items-center hidden group-hover:grid"><FaUpRightFromSquare className="text-3xl pointer-events-none" /></div>
        </Link>
    );
}