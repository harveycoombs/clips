"use client";
import { useState, useEffect } from "react";

import Popup from "@/app/components/ui/popup";
import Field from "@/app/components/ui/field";
import Category from "@/app/components/ui/category";
import Label from "@/app/components/ui/label";

import { getCategories } from "@/data/posts";

interface Properties {
    onClose: any;
}

export default function Filters({ onClose }: Properties) {
    let [categories, setCategories] = useState<string[]>([]);
    let [categoriesAreLoading, setCategoriesLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setCategoriesLoading(true);

            let categoryList = await getCategories();
            setCategories(categoryList);

            setCategoriesLoading(false);
        })();
    }, []);

    function toggleLengthOption(e: any) {
        if (e.target.matches(".bg-blue-50.border-blue-500")) {
            e.target.classList.remove("bg-blue-50", "border-blue-500", "text-blue-500");
            e.target.classList.add("bg-slate-50", "border-slate-300", "text-slate-400/60");
        } else {
            e.target.classList.remove("bg-slate-50", "border-slate-300", "text-slate-400/60");
            e.target.classList.add("bg-blue-50", "border-blue-500", "text-blue-500");
        }
    }

    return (
        <Popup title="Filters" onClose={onClose}>
            <div className="w-800 flex gap-12 flex-nowrap justify-between h-96">
                <div className="w-1/3">
                    <strong className="block text-[0.81rem] font-semibold mt-1 mb-2">Filter by Date</strong>
                    <Label classes="w-full">From</Label>
                    <Field type="date" classes="w-full" />
                    <Label classes="w-full">To</Label>
                    <Field type="date" classes="w-full" />
                </div>
                <div className="w-1/3">
                    <strong className="block text-[0.81rem] font-semibold mt-1 mb-2">Filter by Category</strong>
                    {categoriesAreLoading ? <div className="text-sm text-gray-400">Loading...</div> : <><Field placeholder="Search Categories" classes="w-full mb-2" /><div>{categories.map(category => <Category name={category} />)}</div></>}
                </div>
                <div className="w-1/3">
                    <strong className="block text-[0.81rem] font-semibold mt-1 mb-2">Filter by Length</strong>
                    <div className="px-3 py-2 mb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" onClick={toggleLengthOption}>&lt; 1 Minute</div>
                    <div className="px-3 py-2 mb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" onClick={toggleLengthOption}>1-5 Minutes</div>
                    <div className="px-3 py-2 mb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" onClick={toggleLengthOption}>5-10 Minutes</div>
                </div>
            </div>
        </Popup>
    );
}