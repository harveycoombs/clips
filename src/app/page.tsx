import Header from "./components/header";
import Post from "./components/post";

import { Posts } from "@/data/posts";

export default async function Home() {
    let posts = await Posts.getPosts();
    let categories = await Posts.getCategories();

    return (
        <>
            <Header current="feed" />
            <main className="h-screen w-[800px] mx-auto">
                <h1 className="block text-lg font-semibold select-none">Your Feed</h1>
                <section className="pt-1.5 pb-3 flex gap-1">{categories.map((category: any) => <div className="w-fit bg-indigo-200 bg-opacity-70 text-indigo-500 select-none font-semibold text-xs py-2 px-3 leading-[0.9em] rounded-full">{category.category}</div>)}</section>
                <section className="grid grid-cols-4 gap-2">{
                    posts.map((post: any) => <Post data={post} />)
                }</section>
            </main>
        </>
    );
} 