import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
    return <footer className="p-2.5 bg-white border-t border-t-slate-300 z-30">
        <div className="w-1000 h-[34px] flex justify-between items-center mx-auto font-medium text-slate-400/60">
            <div className="text-sm">{new Date().getFullYear()} &middot; Clips &middot; <Link href="https://harveycoombs.com/" target="_blank" className="hover:underline">Harvey Coombs</Link></div>
            <Link href="https://github.com/harveycoombs/clips" target="_blank" className="text-xl  duration-150 hover:text-slate-400"><FaGithub /></Link>
        </div>
    </footer>;
}