import { cookies } from "next/headers";

import Header from "@/app/components/header";
import Post from "@/app/components/post";

import { Posts } from "@/data/posts";
import { JWT } from "@/data/users";

export default async function Home() {
    let posts = await Posts.getPosts();
    let categories = await Posts.getCategories();

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await JWT.authenticate(token ?? "");

    return (
        <>
            <Header current="feed" user={currentSessionUser} />
            <main className="h-screen w-[840px] mx-auto" key="h">
                <h1 className="block text-lg font-semibold select-none">Your Feed</h1>
                <section key="categories" className="pt-1.5 pb-3 flex gap-1">{categories.map((category: any) => <div key={categories.indexOf(category)} className="w-fit bg-indigo-200 bg-opacity-70 text-indigo-500 select-none font-semibold text-xs py-2 px-3 leading-[0.9em] rounded-full">{category.category}</div>)}</section>
                <section key="posts" className="grid grid-cols-4 gap-2">{
                    posts.map((post: any) => <Post data={post} />)
                }</section>
            </main>
        </>
    );
}