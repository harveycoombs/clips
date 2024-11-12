"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FaFire, FaRegClock, FaEllipsis } from "react-icons/fa6";

import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";
import Uploader from "@/app/components/uploader";

interface Properties {
    current: string;
    user?: any;
}

export default function Header({ current, user }: Properties) {
    let [uploadPopupIsVisible, setUploadPopupVisibility] = useState<boolean>(false);

    let [optionsAreVisible, setOptionsVisibility] = useState<boolean>(false);
    
    let accountOptions = optionsAreVisible ? <div className="w-full absolute top-[120%] border-[1px] border-slate-400 border-opacity-60 rounded-md overflow-hidden select-none"><Link href="/settings" className="block px-2 py-1 text-[0.825rem] font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100">Settings</Link><div className="block px-2 py-1 border-t-[1px] border-slate-400 border-opacity-60 text-[0.825rem] text-red-500 font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100" onClick={logout}>Log Out</div></div> : null;
    let options = user ? <div className="relative inline-block align-middle"><Button classes="inline-block align-middle mr-3" onClick={() => setUploadPopupVisibility(true)}>Upload</Button><HeaderNavigationItem icon={<FaEllipsis />} margin={false} click={() => setOptionsVisibility(!optionsAreVisible)} />{accountOptions}</div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1 hover:bg-slate-200 hover:text-slate-400 hover:text-opacity-80" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.userid}`} title="View Your Profile" className="inline-block align-middle ml-3 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={32} height={32} className="block aspect-square rounded-full object-cover" /></Link> : null;

    async function logout() {
        let response = await fetch("/api/sessions", { method: "DELETE" });

        if (response.ok) {
            window.location.href = "/";
        }
    }

    return (
        <>
            <header className="p-3 bg-slate-50 mb-3">
                <div className="w-[1000px] mx-auto flex justify-between items-center">
                    <Link href="/" className="font-bold text-slate-800 select-none duration-150 hover:opacity-65" draggable="false"><span className="text-blue-500 font-bold inline-block align-middle">Clips</span><span className="bg-red-500 text-white font-semibold rounded px-1.5 py-0.5 text-[0.6rem] ml-1.5 inline-block align-middle">BETA</span></Link>
                    <nav>
                        <Field placeholder="Search" classes="w-72" />
                        <HeaderNavigationItem icon={<FaFire />} classes="ml-3" />
                        <HeaderNavigationItem icon={<FaRegClock />} classes="ml-3" />
                    </nav>
                    <div>
                        {options}
                        {userAvatar}
                    </div>
                </div>
            </header>
            {uploadPopupIsVisible ? <Uploader /> : null}
        </>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.classes ? props.classes : ""} text-lg ${props.selected ? "text-blue-500" : "text-slate-300"} cursor-pointer duration-150${props.selected ? " hover:text-blue-600" : " hover:text-slate-400"}`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}>{props.icon}</Link> : <div className={classList} draggable={false} onClick={props.click}>{props.icon}</div>;
}