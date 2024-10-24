import Link from "next/link";

export default function Footer() {
    return <footer className="p-3 w-[840px] text-xs font-medium text-slate-300 text-center mx-auto">{new Date().getFullYear()} &middot; Clips &middot; <Link href="https://harveycoombs.com/" target="_blank">Harvey Coombs</Link></footer>;
}