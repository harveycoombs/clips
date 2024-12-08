"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FaSliders, FaEllipsis } from "react-icons/fa6";

import Button from "@/app/components/common/button";
import Field from "@/app/components/common/field";
import Uploader from "@/app/components/uploader";
import ClipsLogo from "@/app/components/common/logo";
import Search from "@/app/components/search";
import Filters from "@/app/components/filters";

interface Properties {
    user?: any;
}

export default function Header({ user }: Properties) {
    let [optionsAreVisible, setOptionsVisibility] = useState<boolean>(false);
    let [uploadPopupIsVisible, setUploadPopupVisibility] = useState<boolean>(false);
    let [filtersPopupIsVisible, setFiltersPopupVisibility] = useState<boolean>(false);
    
    let [searchQuery, setSearchQuery] = useState<string>("");

    let accountOptions = optionsAreVisible ? <div className="w-full absolute top-[120%] border-[1px] border-slate-400 border-opacity-60 rounded-md overflow-hidden select-none dark:border-slate-600"><Link href="/settings" className="block px-2 py-1 text-[0.825rem] font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800 dark:text-white hover:dark:bg-slate-700/60 active:dark:bg-slate-700/40">Settings</Link><div className="block px-2 py-1 border-t-[1px] border-slate-400 border-opacity-60 text-[0.825rem] text-red-500 font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800  hover:dark:bg-slate-700/60 active:dark:bg-slate-700/40" onClick={logout}>Log Out</div></div> : null;
    let options = user ? <div className="relative inline-block align-middle"><Button classes="inline-block align-middle mr-3" onClick={() => setUploadPopupVisibility(true)}>Upload</Button><HeaderNavigationItem icon={<FaEllipsis />} margin={false} click={() => setOptionsVisibility(!optionsAreVisible)} />{accountOptions}</div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.username}`} title="View Your Profile" className="inline-block align-middle ml-3 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={32} height={32} className="block aspect-square rounded-md object-cover" /></Link> : null;

    async function logout() {
        let response = await fetch("/api/sessions", { method: "DELETE" });

        if (response.ok) {
            window.location.href = "/";
        }
    }

    return (
        <>
            <header className="p-2.5 bg-white sticky top-0 border-b border-b-slate-300 z-30 dark:bg-slate-800 dark:border-b-slate-600">
                <div className="w-full h-[34px] mx-auto flex justify-between items-center">
                    <Link href="/" className="select-none duration-150 hover:opacity-65" draggable="false"><ClipsLogo width="59" height="27" className="inline-block align-middle" /></Link>
                    <nav>
                        <Field placeholder="Search" classes="w-80" onInput={(e: any) => {
                            setSearchQuery(e.target.value);
                        }} />
                        <HeaderNavigationItem icon={<FaSliders />} classes="ml-3" click={() => setFiltersPopupVisibility(true)} />
                    </nav>
                    <div>
                        {options}
                        {userAvatar}
                    </div>
                </div>
            </header>
            {uploadPopupIsVisible ? <Uploader onClose={() => setUploadPopupVisibility(false)} /> : null}
            {filtersPopupIsVisible ? <Filters onClose={() => setFiltersPopupVisibility(false)} onApply={(filters: any) => {
                setFiltersPopupVisibility(false);
            }} /> : null}
            <Search query={searchQuery} />
        </>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.classes ? props.classes : ""} text-lg text-slate-300 dark:text-slate-500 cursor-pointer duration-150 hover:text-slate-400 hover:dark:text-slate-600`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}>{props.icon}</Link> : <div className={classList} draggable={false} onClick={props.click}>{props.icon}</div>;
}