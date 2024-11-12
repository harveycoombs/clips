"use client";
import Link from "next/link";
import Image from "next/image";

import { searchUsers } from "@/data/users";
import { useState, useEffect } from "react";

interface Properties {
    query: string;
}

export default function Search({ query }: Properties) {
    let [users, setUsers] = useState<any[]>([]);
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const result = await searchUsers(query);
            setUsers(result);
            setLoading(false);
        })();
    }, [query]);

    return (
        <div className="fixed inset-0 w-screen h-screen z-20 bg-gray-800 bg-opacity-10 backdrop-blur pt-20">
            <div className="w-[1000px] bg-white p-3 rounded-lg mx-auto shadow-md cursor-pointer">
                <strong className="block text-base font-bold select-none mb-2">
                    {loading ? "Loading..." : `Showing ${users.length} Results`}
                </strong>
                {users?.map((user: any) => <UserSearchResult key={user.userid} user={user} />)}
            </div>
        </div>
    );
}

function UserSearchResult(props: any) {
    return (
        <Link href="/" target="_blank" draggable="false" className="p-2.5 rounded-md flex justify-between items-center duration-150 hover:bg-slate-50 active:bg-slate-100">
            <div>
                <Image src={`/uploads/avatars/${props.user.userid}`} alt="User" draggable="false" width={46} height={46} className="object-cover aspect-square rounded-full shadow-md inline-block align-middle select-none" />
                <div className="inline-block align-middle ml-3 select-none">
                    <strong className="block text-base font-bold leading-tight text-slate-600">{props.user.firstname} {props.user.lastname}</strong>
                    <div className="text-sm font-medium text-slate-400 text-opacity-70">{props.user.totalposts} posts &middot; {props.user.locations}</div>
                </div>
            </div>
        </Link>
    );
}