import Button from "./button";

interface Properties {
    type?: string;
    classes?: string;
    button?: any;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ type, classes, button, error, warning, ...rest }: Properties) {
    let appearance;

    switch (true) {
        case error:
            appearance = "bg-red-50 border-red-500 text-red-500";
            break;
        case warning:
            appearance = "bg-amber-50 border-amber-500 text-amber-500";
            break;
        default:
            appearance = "bg-transparent border-slate-300 text-slate-900";
            break;
    }

    let classList = `${button ? "py-2 pl-4 pr-2" : "py-2 px-4"} rounded-full text-[0.8rem] select-none duration-150 ${button ? "flex align-middle gap-6 " : ""}${classes?.length ? " " + classes : ""} border-[1px] ${appearance} focus:outline-none focus:border-indigo-500`;

    return button ? <div className={classList}><input type={type ?? "text"} className="w-full focus:outline-none" {...rest} /><Button click={button.click} classes="text-xs">{button.text}</Button></div> : <input type={type ?? "text"} className={classList} {...rest} />;
}