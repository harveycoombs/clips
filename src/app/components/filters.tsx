"use client";
import { useState, useEffect } from "react";

import { FaCircleNotch } from "react-icons/fa6";

import Popup from "@/app/components/common/popup";
import Field from "@/app/components/common/field";
import Category from "@/app/components/common/category";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";

import { getCategories } from "@/data/posts";

interface Properties {
    onClose: any;
    onApply: any;
}

export default function Filters({ onClose, onApply }: Properties) {
    let [categories, setCategories] = useState<string[]>([]);
    let [categoriesAreLoading, setCategoriesLoading] = useState<boolean>(false);

    let [fromDate, setFromDate] = useState<string>("");
    let [toDate, setToDate] = useState<string>("");
    let [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    let [selectedLengths, setSelectedLengths] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            setCategoriesLoading(true);

            let categoryList = await getCategories();
            setCategories(categoryList);

            setCategoriesLoading(false);
        })();
    }, []);

    function toggleLengthOption(e: any) {
        let length = e.target.dataset.length;

        if (e.target.matches(".bg-blue-50.border-blue-500")) {
            e.target.classList.remove("bg-blue-50", "border-blue-500", "text-blue-500");
            e.target.classList.add("bg-slate-50", "border-slate-300", "text-slate-400/60");

            setSelectedLengths(selectedLengths.splice(selectedLengths.indexOf(length), 1));
        } else {
            e.target.classList.remove("bg-slate-50", "border-slate-300", "text-slate-400/60");
            e.target.classList.add("bg-blue-50", "border-blue-500", "text-blue-500");

            setSelectedLengths([...selectedLengths, length]);
        }
    }

    function toggleCategory(e: any) {
        let category = e.target.textContent.trim();

        if (e.target.matches(".bg-blue-50.border-blue-500")) {
            e.target.classList.remove("bg-blue-50", "text-blue-500");
            e.target.classList.add("bg-slate-50", "text-slate-400/60");

            setSelectedCategories(selectedCategories.splice(selectedCategories.indexOf(category), 1));
        } else {
            e.target.classList.remove("bg-slate-50", "text-slate-400/60");
            e.target.classList.add("bg-blue-50", "text-blue-500");

            setSelectedCategories([...selectedCategories, category]);
        }
    }

    return (
        <Popup title="Filters" onClose={onClose}>
            <div className="w-800 flex gap-12 flex-nowrap justify-between max-h-96">
                <div className="w-1/3">
                    <strong className="block text-[0.82rem] font-semibold mt-1 mb-2">Filter by Date</strong>
                    <Label classes="w-full">From</Label>
                    <Field type="date" classes="w-full" onInput={(e: any) => setFromDate(e.target.value)} />
                    <Label classes="w-full">To</Label>
                    <Field type="date" classes="w-full" onInput={(e: any) => setToDate(e.target.value)} max="2024-11-14" />
                </div>
                <div className="w-1/3">
                    <strong className="block text-[0.82rem] font-semibold mt-1 mb-2" key="title">Filter by Category</strong>
                    {categoriesAreLoading ? <div className="text-sm text-gray-400" key="loader"><FaCircleNotch className="animate-spin" /></div> : <><Field key="fieldnhsd" placeholder="Search Categories" classes="w-full mb-2" /><div key="list" className="flex gap-1 w-full flex-wrap">{categories.map(category => <Category name={category} onClick={toggleCategory} />)}</div></>}
                </div>
                <div className="w-1/3">
                    <strong className="block text-[0.82rem] font-semibold mt-1 mb-2">Filter by Length</strong>
                    <div className="px-3 py-2 mb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" data-length="lt1" onClick={toggleLengthOption}>&lt; 1 Minute</div>
                    <div className="px-3 py-2 mb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" data-length="1t5" onClick={toggleLengthOption}>1-5 Minutes</div>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-400/60 select-none cursor-pointer text-[0.8rem]" data-length="5t10" onClick={toggleLengthOption}>5-10 Minutes</div>
                </div>
            </div>
            <div className="w-fit ml-auto mt-2.5">
                <Button classes="bg-red-500 mr-2.5 hover:bg-red-600 active:bg-red-700">Clear Filters</Button>
                <Button onClick={() => onApply({ fromDate: fromDate, toDate: toDate, categories: selectedCategories, lengths: selectedLengths })}>Apply Filters</Button>
            </div>
        </Popup>
    );
}