"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faUserGroup, faRobot, faMagnifyingGlass, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";

interface Properties {
    current: string;
    user?: any;
}

export default function Header({ current, user }: Properties) {
    let options = user ? <div><Button classes="inline-block align-middle mr-4">Upload</Button><HeaderNavigationItem icon={faEllipsis} margin={false} /></div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.userid}`} title="View Your Profile" className="inline-block align-middle mx-6 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={26} height={26} className="block aspect-square rounded-full object-cover" /></Link> : null;

let [searchAreaIsVisible, setSearchAreaVisibility] = useState<boolean>(false);
    return (
        <>
            <header className="p-3">
                <div className="w-[840px] mx-auto flex justify-between items-center">
                    <Link href="/" className="font-bold text-slate-800 select-none" draggable="false"><span className="text-indigo-500">clips</span>.harveycoombs.com</Link>
                    <nav>
                        <HeaderNavigationItem icon={faBorderAll} url="/" selected={current == "feed"} margin={true} />
                        <HeaderNavigationItem icon={faUserGroup} url="/users" selected={current == "users"} margin={true} />
                        <HeaderNavigationItem icon={faRobot} url="/ai" selected={current == "ai"} margin={true} />
                        <HeaderNavigationItem icon={faMagnifyingGlass} margin={true} selected={searchAreaIsVisible} click={() => setSearchAreaVisibility(!searchAreaIsVisible)} />
                        {userAvatar}
                    </nav>
                    {options}
                </div>
            </header>
            {searchAreaIsVisible ? <div className="w-[840px] mx-auto">
                <Field button={{ text: "Search", click: () => alert("Search was performed") }} classes="mb-3" placeholder="Search..." />
            </div>: null}
        </>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.margin ? "mx-6" : ""} text-xl ${props.selected ? "text-indigo-500" : "text-slate-300"} cursor-pointer duration-150${props.selected ? " hover:text-indigo-600" : " hover:text-slate-400"}`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}><FontAwesomeIcon icon={props.icon} /></Link> : <div className={classList} draggable={false} onClick={props.click}><FontAwesomeIcon icon={props.icon} /></div>;
}