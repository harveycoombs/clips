import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/header";
import { Users } from "@/data/users";
import Button from "@/app/components/ui/button";

export default async function IndividualUser(e: any) {
    let user = await Users.getUser(e.params.id.trim());

    let fullName = `${user.firstname} ${user.lastname}`;

    return (
        <>
            <Header current="users" />
            <main className="h-screen w-[800px] mx-auto">
                <h1 className="block text-lg font-semibold mb-3 select-none">User <span className="text-slate-400 text-opacity-60 pr-2">&#35;{user.userid}</span></h1>
                <section className="flex justify-between items-center">
                    <div>
                        <Image src={`/uploads/avatars/${user.userid}`} alt={fullName} width={60} height={60} className="inline-block align-middle aspect-square object-cover rounded-[4px]" />
                        <div className="inline-block align-middle ml-4 pb-1">
                            <strong className="text-lg font-bold">{fullName}</strong>
                            <div className="text-sm font-medium text-slate-400 text-opacity-60"><FontAwesomeIcon icon={faLocationDot} /> {user.location}</div>
                        </div>
                    </div>
                </section>
                <h2 className="block font-semibold mt-6 mb-3 select-none">{user.firstname}&apos;s Posts</h2>
                <section></section>
            </main>
        </>
    );
}