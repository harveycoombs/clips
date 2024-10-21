import Button from "./button";

interface Properties {
    type?: string;
    classes?: string;
    button?: any;
    [key: string]: any;
}

export default function Field({ type, classes, button, ...rest }: Properties) {
    let classList = `${button ? "py-2 pl-4 pr-2" : "py-2 px-4"} rounded-full text-[0.8rem] select-none duration-150 ${button ? "flex align-middle gap-6 " : ""}${classes?.length ? " " + classes : ""} bg-transparent border-[1px] border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500`;
    return button ? <div className={classList}><input type={type ?? "text"} className="w-full focus:outline-none" {...rest} /><Button click={button.click} classes="text-xs">{button.text}</Button></div> : <input type={type ?? "text"} className={classList} {...rest} />;
}