import { cookies } from "next/headers";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faFilm, faComments, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

import { Users, JWT } from "@/data/users";
import { Posts } from "@/data/posts";

import Header from "@/app/components/header";
import Post from "@/app/components/post";

export default async function IndividualUser(e: any) {
    let userid = parseInt((await e.params).id.trim());

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await JWT.authenticate(token ?? "");

    let user = await Users.getUser(userid);
    let fullName = `${user.firstname} ${user.lastname}`;

    let posts = await Posts.getPosts(0, userid);

    return (
        <>
            <Header current="users" user={currentSessionUser} />
            <main className="h-screen w-[840px] mx-auto">
                <h1 className="block text-lg font-semibold mb-3 select-none">User <span className="text-slate-400 text-opacity-60 pr-2">&#35;{user.userid}</span></h1>
                <section className="flex justify-between items-center">
                    <div>
                        <Image src={`/uploads/avatars/${user.userid}`} alt={fullName} width={60} height={60} className="inline-block align-middle aspect-square object-cover rounded-[4px]" />
                        <div className="inline-block align-middle ml-4 pb-1">
                            <strong className="text-lg font-bold">{fullName}</strong>
                            <div className="text-sm font-medium text-slate-400 text-opacity-60"><FontAwesomeIcon icon={faLocationDot} /> {user.location}</div>
                        </div>
                    </div><div className="text-[0.825rem] font-medium text-slate-400 text-opacity-60">
                        <div title="Videos" className="mb-1"><FontAwesomeIcon icon={faFilm} /> {0}</div>
                        <div title="Comments" className="mb-1"><FontAwesomeIcon icon={faComments} /> {0}</div>
                        <div title="Comments"><FontAwesomeIcon icon={faCalendarDays} /> {user.creationdate.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                    </div>
                </section>
                <h2 className="block font-semibold mt-6 mb-3 select-none">{user.firstname}&apos;s Posts</h2>
                <section key="posts" className="grid grid-cols-4 gap-2">{
                    posts.map((post: any) => <Post data={post} />)
                }</section>
            </main>
        </>
    );
}