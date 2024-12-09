interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    list?: string[];
    [key: string]: any;
}

export default function Field({ type, classes, small, error, warning, list, ...rest }: Properties) {
    let appearance;

    switch (true) {
        case error:
            appearance = "bg-red-50 text-red-500";
            break;
        case warning:
            appearance = "bg-amber-50 text-amber-500";
            break;
        default:
            appearance = "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white placeholder-slate-400/70";
            break;
    }

    let classList = `py-2 px-4 rounded-md text-[0.8rem] leading-snug select-none duration-150 ${classes?.length ? " " + classes : ""} ${appearance} focus:outline-none focus:bg-slate-200 focus:bg-opacity-75 focus:dark:bg-slate-600`;

    if (list?.length) {
        return (
            <>
                <input type={type ?? "text"} className={classList} {...rest} list="suggestions" />
                <datalist id="suggestions">{list.map(item => <option value={item} />)}</datalist>
            </>
        );
    }

    return <input type={type ?? "text"} className={classList} {...rest} />;
}