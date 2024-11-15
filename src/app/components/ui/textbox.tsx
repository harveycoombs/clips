interface Properties {
    classes?: string;
    [key: string]: any;
}

export default function TextBox({ type, placeholder, classes, ...rest }: Properties) {
    let classList = `py-2 px-4 rounded-md text-[0.8rem] cursor-pointer select-none duration-150 ${classes?.length ? " " + classes : ""} bg-slate-100 text-slate-900 focus:outline-none focus:border-blue-500`;

    return (
        <textarea className={classList} {...rest}></textarea>
    );
}