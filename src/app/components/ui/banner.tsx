"use client";
import { useRef } from "react";
import { FaXmark } from "react-icons/fa6";

interface Properties {
    children: React.ReactNode;
    classes?: string;
}

export default function Banner({ children, classes }: Properties) {
    let banner = useRef<HTMLDivElement>(null);

    function closeBanner() {
        if (!banner?.current) return;
        banner.current.remove();
    }

    let classList = `relative p-1 text-sm font-medium select-none text-center bg-blue-100 text-blue-600${classes?.length ? " " + classes : ""}`;

    return (
        <div className={classList} ref={banner}>{children}<div className="absolute right-1.5 top-1.5 text-base select-none cursor-pointer hover:text-blue-400" onClick={closeBanner}><FaXmark /></div></div>
    );
}