interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ type, classes, small, error, warning, ...rest }: Properties) {
    let appearance;

    switch (true) {
        case error:
            appearance = "bg-red-50 text-red-500";
            break;
        case warning:
            appearance = "bg-amber-50 text-amber-500";
            break;
        default:
            appearance = "bg-slate-100 text-slate-900";
            break;
    }

    let classList = `py-2 px-4 rounded-full text-[0.8rem] leading-snug select-none duration-150 ${classes?.length ? " " + classes : ""} ${appearance} focus:outline-none focus:border-blue-500`;

    return <input type={type ?? "text"} className={classList} {...rest} />;
}