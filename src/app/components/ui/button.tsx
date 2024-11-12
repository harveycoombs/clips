import Link from "next/link";

interface Properties {
    children: React.ReactNode;
    classes?: string;
    url?: string;
    transparent?: boolean;
    [key: string]: any;
}

export default function Button({ children, classes, url, transparent, ...rest }: Properties) {
    let appearance = transparent ? "bg-transparent hover:bg-slate-50 hover:text-slate-600" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700";
    let classList = `py-2 px-4 rounded-full text-[0.8rem] leading-snug text-center font-semibold cursor-pointer select-none duration-150 ${appearance} ${classes?.length ? " " + classes : ""}`;

    return (
        url?.length ? <Link href={url} className={classList} draggable={false} {...rest}>{children}</Link> : <button className={classList} draggable={false} {...rest}>{children}</button>
    );
}