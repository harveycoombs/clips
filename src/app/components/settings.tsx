"use client";
import { useState } from "react";
import { FaCircleNotch } from "react-icons/fa6";

import Label from "@/app/components/common/label";
import Field from "./common/field";

interface Properties {
    user: any;
    settings: any;
}

type SectionName = "general" | "account" | "privacy";

export default function Settings({ user, settings }: Properties) {
    var sections: Record<SectionName, { title: string; content: React.JSX.Element }> = {
        "general": {
            title: "General Settings",
            content: <FaCircleNotch className="animate-spin text-xl text-slate-400/60 mt-2" />
        },
        "account": {
            title: "Account Settings",
            content: <FaCircleNotch className="animate-spin text-xl text-slate-400/60 mt-2" />
        },
        "privacy": {
            title: "Privacy Settings",
            content: <FaCircleNotch className="animate-spin text-xl text-slate-400/60 mt-2" />
        }
    };

    if (settings) {
        sections["general"].content = <SubSection title="Theme">
            <div>
                <div className="inline-block align-middle text-sm font-semibold px-3 py-2 rounded-md border bg-white text-slate-800 border-slate-300 select-none cursor-pointer duration-150 mr-2 hover:shadow-md active:bg-slate-50">Light</div>
                <div className="inline-block align-middle text-sm font-semibold px-3 py-2 rounded-md border bg-slate-800 text-white border-slate-300 select-none cursor-pointer duration-150 mr-2 hover:shadow-md active:bg-slate-900">Dark</div>
                <div className="inline-block align-middle text-sm font-semibold px-3 py-2 rounded-md border border-slate-300 select-none cursor-pointer duration-150 hover:shadow-md active:bg-slate-50">System</div>
            </div>
        </SubSection>;
    }

    if (user) {
        sections["account"].content = <>
            <SubSection title="Public Details">
                <div className="flex gap-6">
                    <div className="w-1/3">
                        <Label>First Name</Label>
                        <Field classes="block w-full" />
                    </div>
                    <div className="w-1/3">
                        <Label>Last Name</Label>
                        <Field classes="block w-full" />
                    </div>
                    <div className="w-1/3">
                        <Label>Username</Label>
                        <Field classes="block w-full" />
                    </div>
                </div>
            </SubSection>
            <SubSection title="Account Credentials">

            </SubSection>
            <SubSection title="Password"></SubSection>
        </>
    }

    let [currentSection, setCurrentSection] = useState<SectionName>("general");
    let [sectionTitle, setSectionTitle] = useState<string>(sections["general"].title);
    let [sectionContent, setSectionContent] = useState<React.JSX.Element>(sections["general"].content);

    function changeSection(name: SectionName) {
        setCurrentSection(name);
        setSectionTitle(sections[name].title);
        setSectionContent(sections[name].content);
    }

    return (
        <div className="flex flex-nowrap h-full">
            <aside className="w-56 pt-3 pr-3 border-r border-r-slate-300 flex-shrink-0 h-full">
                <MenuItem selected={currentSection == "general"} onClick={() => changeSection("general")}>General</MenuItem>
                <MenuItem selected={currentSection == "account"} onClick={() => changeSection("account")}>Account</MenuItem>
                <MenuItem selected={currentSection == "privacy"} onClick={() => changeSection("privacy")}>Privacy</MenuItem>
            </aside>
            <section className="w-full p-3">
                <h1 className="block text-lg font-bold select-none">{sectionTitle}</h1>
                {sectionContent}
            </section>
        </div>
    );
}

function MenuItem({ selected, onClick, children }: any) {
    return <div className={`w-full px-3 py-2 text-sm font-medium rounded-md ${selected ? "bg-slate-50 dark:bg-slate-700/50" : "bg-transparent"} ${selected ? "text-slate-400" : "text-slate-400/60"} mb-1 cursor-pointer select-none duration-150 hover:bg-slate-50 hover:text-slate-400 active:bg-slate-100 active:text-slate-400 hover:dark:bg-slate-700/50`} onClick={onClick}>{children}</div>
}

function SubSection({ title, children }: any) {
    return (
        <div className="mt-3">
            <h2 className="block font-bold mb-1.5">{title}</h2>
            {children}
        </div>
    );
}