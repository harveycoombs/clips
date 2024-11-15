import { cookies } from "next/headers";

import { FaQuestion } from "react-icons/fa6";

import Header from "@/app/components/header";
import Post from "@/app/components/post";
import Category from "@/app/components/ui/category";

import { getPosts, getCategories } from "@/data/posts";
import { authenticate } from "@/data/jwt";

export default async function Home() {
    let posts = await getPosts();
    let categories = await getCategories();

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    let postsGrid = posts?.length ? posts.map((post: any) => <Post data={post} />) : <div className="text-slate-300 text-center pointer-events-none select-none mb-24">{<FaQuestion className="text-[6rem] mx-auto" />}<strong className="block mx-auto mt-4 text-lg font-bold text-slate-400">No Posts Found</strong><div className="mx-auto mt-2 text-sm text-slate-300 font-medium">Try refreshing the page<br/>or come back later</div></div>;

    return (
        <>
            <Header user={currentSessionUser} />
            <main className="h-[calc(100vh-110px)] w-1000 mx-auto pt-3" key="h">
                <h1 className="block text-lg font-bold select-none">Your Feed</h1>
                {posts?.length ? <section key="categories" className="pt-1.5 pb-3 flex gap-1">{categories.map((category: any) => <Category name={category} />)}</section> : null}
                <section key="posts" className={`grid ${posts?.length ? "grid-cols-5 gap-2" : "place-items-center h-full"}`}>{postsGrid}</section>
            </main>
        </>
    );
}