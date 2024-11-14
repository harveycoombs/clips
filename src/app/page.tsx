import { cookies } from "next/headers";

import Header from "@/app/components/header";
import Post from "@/app/components/post";

import { getPosts, getCategories } from "@/data/posts";
import { authenticate } from "@/data/jwt";
import Category from "./components/ui/category";

export default async function Home() {
    let posts = await getPosts();
    let categories = await getCategories();

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    return (
        <>
            <Header user={currentSessionUser} />
            <main className="h-screen w-1000 mx-auto" key="h">
                <h1 className="block text-lg font-semibold select-none">Your Feed</h1>
                <section key="categories" className="pt-1.5 pb-3 flex gap-1">{categories.map((category: any) => <Category name={category} />)}</section>
                <section key="posts" className="grid grid-cols-4 gap-2">{posts.map((post: any) => <Post data={post} />)}</section>
            </main>
        </>
    );
}