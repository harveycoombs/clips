"use client";
import { useState, useEffect } from "react";

import Popup from "@/app/components/ui/popup";
import Field from "@/app/components/ui/field";
import Category from "@/app/components/ui/category";

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

    return (
        <Popup title="Filters" onClose={onClose}>
            <div className="w-1000 flex gap-8 flex-nowrap justify-between">
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Date</strong>
                    
                </div>
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Category</strong>
                    
                    {categoriesAreLoading ? <div className="text-sm text-gray-400">Loading...</div> : <><Field placeholder="Search Categories" /><div>{categories.map(category => <Category name={category} />)}</div></>}
                </div>
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Length</strong>
                </div>
            </div>
        </Popup>
    );
}