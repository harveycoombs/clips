interface Properties {
    type?: string;
    classes?: string;
    [key: string]: any;
}

export default function Field({ type, placeholder, classes, ...rest }: Properties) {
    let classList = `py-2 px-4 rounded-full text-[0.8rem] select-none duration-150 ${classes?.length ? " " + classes : ""} bg-transparent border-[1px] border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500`;

    return (
        <input type={type ?? "text"} className={classList} {...rest} />
    );
}