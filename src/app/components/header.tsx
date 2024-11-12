"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FaSliders, FaEllipsis } from "react-icons/fa6";

import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";
import Uploader from "@/app/components/uploader";
import ClipsLogo from "@/app/components/logo";

interface Properties {
    current: string;
    user?: any;
}

export default function Header({ current, user }: Properties) {
    let [uploadPopupIsVisible, setUploadPopupVisibility] = useState<boolean>(false);
    //let [searchIsVisible, setSearchVisibility] = useState<boolean>(false);

    let [optionsAreVisible, setOptionsVisibility] = useState<boolean>(false);
    
    let accountOptions = optionsAreVisible ? <div className="w-full absolute top-[120%] border-[1px] border-slate-400 border-opacity-60 rounded-md overflow-hidden select-none"><Link href="/settings" className="block px-2 py-1 text-[0.825rem] font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100">Settings</Link><div className="block px-2 py-1 border-t-[1px] border-slate-400 border-opacity-60 text-[0.825rem] text-red-500 font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100" onClick={logout}>Log Out</div></div> : null;
    let options = user ? <div className="relative inline-block align-middle"><Button classes="inline-block align-middle mr-3" onClick={() => setUploadPopupVisibility(true)}>Upload</Button><HeaderNavigationItem icon={<FaEllipsis />} margin={false} click={() => setOptionsVisibility(!optionsAreVisible)} />{accountOptions}</div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.userid}`} title="View Your Profile" className="inline-block align-middle ml-3 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={32} height={32} className="block aspect-square rounded-full object-cover" /></Link> : null;

    async function logout() {
        let response = await fetch("/api/sessions", { method: "DELETE" });

        if (response.ok) {
            window.location.href = "/";
        }
    }

    return (
        <>
            <header className="p-2.5 mb-3 bg-white sticky top-0 border-b border-b-slate-300 z-30">
                <div className="w-[1000px] mx-auto flex justify-between items-center">
                    <Link href="/" className="select-none duration-150 hover:opacity-65" draggable="false"><ClipsLogo width="59" height="27" className="inline-block align-middle" /></Link>
                    <nav>
                        <Field placeholder="Search" classes="w-72" />
                        <HeaderNavigationItem icon={<FaSliders />} classes="ml-3" />
                    </nav>
                    <div>
                        {options}
                        {userAvatar}
                    </div>
                </div>
            </header>
            {uploadPopupIsVisible ? <Uploader /> : null}
            <div className="fixed inset-0 w-screen h-screen z-20 bg-gray-800 bg-opacity-10 backdrop-blur pt-20">
                <div className="w-[1000px] bg-white p-3 rounded-md mx-auto shadow-md">
                    <strong className="block text-base font-bold select-none">Showing {0} Results</strong>
                </div>
            </div>
        </>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.classes ? props.classes : ""} text-lg ${props.selected ? "text-blue-500" : "text-slate-300"} cursor-pointer duration-150${props.selected ? " hover:text-blue-600" : " hover:text-slate-400"}`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}>{props.icon}</Link> : <div className={classList} draggable={false} onClick={props.click}>{props.icon}</div>;
}