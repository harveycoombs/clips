interface Properties {
    classes?: string;
    [key: string]: any;
}

export default function TextBox({ type, placeholder, classes, ...rest }: Properties) {
    let classList = `py-2 px-4 rounded-full text-[0.8rem] cursor-pointer select-none duration-150 ${classes?.length ? " " + classes : ""} bg-transparent border-[1px] border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500`;

    return (
        <textarea className={classList} {...rest}></textarea>
    );
}