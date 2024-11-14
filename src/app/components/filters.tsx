import { useState } from "react";

import Popup from "@/app/components/ui/popup";
import Field from "@/app/components/ui/field";
import Category from "@/app/components/ui/category";

interface Properties {
    onClose: any;
}

export default async function Filters({ onClose }: Properties) {
    let categories = await getCategories();

    return (
        <Popup title="Filters" onClose={onClose}>
            <div className="w-1000 flex gap-8 flex-nowrap justify-between">
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Date</strong>
                    
                </div>
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Category</strong>
                    <Field placeholder="Search Categories" />
                    <div>{categories.map(category => <Category name={category} />)}</div>
                </div>
                <div className="w-1/3">
                    <strong className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Filter by Length</strong>
                </div>
            </div>
        </Popup>
    );
}

async function getCategories(): Promise<string[]> {
    let response = await fetch("/api/categories");
    let data = await response.json();

    return data;
}