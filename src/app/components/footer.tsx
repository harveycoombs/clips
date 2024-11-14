import Link from "next/link";

export default function Footer() {
    return <footer className="p-2.5 bg-white border-t border-t-slate-300 z-30">
        <div className="w-1000 h-[34px] flex justify-between items-center mx-auto text-sm font-medium text-slate-400/60">
            <div>{new Date().getFullYear()} &middot; Clips &middot; <Link href="https://harveycoombs.com/" target="_blank" className="hover:underline">Harvey Coombs</Link></div>
        </div>
    </footer>;
}