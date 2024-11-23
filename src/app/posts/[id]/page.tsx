import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { FaBookmark, FaShareFromSquare } from "react-icons/fa6";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";

import { getPost } from "@/data/posts";
import { authenticate } from "@/data/jwt";

export default async function IndividualPost(e: any) {
    let post = await getPost((await e.params).id.trim());

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    return (        
        <>
            <Header user={currentSessionUser} />
            <main className="h-[calc(100vh-110px)] w-1000 mx-auto pt-3 overflow-auto">
                <section className="flex justify-between items-center">
                    <h1 className="block text-lg font-semibold select-none">{post.title} <span className="text-slate-400/60">&ndash; {post.category}</span></h1>
                    <div className="text-sm text-slate-400/60 font-medium select-none" title={post.publishdate.toString()}>Posted 3h ago</div>
                </section>
                <section className="bg-slate-50 rounded-lg overflow-hidden aspect-video w-full mt-3">
                    <video src={`/uploads/posts/${post.postid}`} controls className="w-full aspect-video"></video>
                </section>
                <section className="flex justify-between items-center mt-3 font-medium text-slate-400/60">
                    <Link href={`/users/${post.username}`} className="inline-block align-middle">
                        <Image src={`/uploads/avatars/${post.userid}`} alt={`${post.id}`} width={42} height={42} className="object-cover aspect-square rounded-md inline-block align-middle mr-2.5" />
                        <div className="inline-block align-middle">
                            <strong className="leading-none font-bold text-slate-900">{post.firstname} {post.lastname}</strong>
                            <div className="text-xs py-0.5 px-1.5 bg-blue-100 text-blue-500 rounded-md w-fit">@{post.username}</div>
                        </div>
                    </Link>
                    <div>
                        <div className="inline-block align-middle text-lg duration-150 cursor-pointer hover:text-slate-400"><FaBookmark /></div>
                        <div className="inline-block align-middle text-lg ml-4 duration-150 cursor-pointer hover:text-slate-400"><FaShareFromSquare /></div>
                        <Button classes="inline-block align-middle ml-3">Download</Button>
                    </div>
                </section><section className="text-sm text-slate-500 font-medium mt-3">                
                    {post.description}
                </section>
            </main>
        </>
    );
}