import { cookies } from "next/headers";
import Link from "next/link";

import { Users, JWT } from "@/data/users";
import Header from "@/app/components/header";

import { FaHashtag, FaFilm, FaUpRightFromSquare } from "react-icons/fa6";

export default async function AllUsers() {
    let users = await Users.getUsers();
    let total = await Users.getTotalUsers();

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await JWT.authenticate(token ?? "");

    return (
        <>
            <Header current="users" user={currentSessionUser} />
            <main className="h-screen w-[960px] mx-auto">
                <h1 className="block text-lg font-semibold mb-3 select-none">All Users <span className="text-slate-400 text-opacity-60">&ndash; {total}</span></h1>
                <section>{users.map((user: any) => <User data={user} />)}</section>
            </main>
        </>
    );
}

function User(props: any) {
    let user = props.data;

    return (
        <article className="flex justify-between items-center px-2 py-1.5 mt-2 rounded-md bg-slate-100 text-slate-400 text-opacity-75" key={user.userid}>
            <div>
                <strong className="font-semibold text-slate-500">{user.firstname} {user.lastname}</strong>
                <div className="text-[0.825rem] font-semibold select-none mt-0.5"><FaHashtag className="inline-block align-middle mr-0.5" /><span className="inline-block align-middle">{user.userid}</span><span className="inline-block align-middle px-1">&middot;</span><FaFilm className="inline-block align-middle mr-0.5" /><span className="inline-block align-middle mr-0.5">{user.totalposts}</span></div>
            </div>
            <Link href={`/users/${user.userid}`} className="text-lg cursor-pointer duration-150 hover:text-slate-500 hover:text-opacity-75 active:text-slate-600 active:text-opacity-75" target="_blank" title={`View ${user.firstname} ${user.lastname} in a new tab`} draggable="false"><FaUpRightFromSquare /></Link>
        </article>
    );
}