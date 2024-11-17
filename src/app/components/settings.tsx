"use client";
import { useState } from "react";

export default function Settings() {
    let [sectionTitle, setSectionTitle] = useState<string>("General Settings");

    return (
        <div className="flex flex-nowrap h-full">
            <aside className="w-56 pt-3 pr-3 border-r border-r-slate-300 flex-shrink-0 h-full">
                <MenuItem>General</MenuItem>
                <MenuItem>Account</MenuItem>
                <MenuItem>Privacy</MenuItem>
            </aside>
            <section className="w-full p-3">
                <h1 className="block text-lg font-bold select-none">{sectionTitle}</h1>
            </section>
        </div>
    );
}

function MenuItem(props: any) {
    return <div className="w-full px-3 py-2 text-sm font-medium rounded-md text-slate-400/60 cursor-pointer select-none duration-150 hover:bg-slate-50 hover:text-slate-400 active:bg-slate-100 active:text-slate-400" onClick={props.onClick}>{props.children}</div>
}