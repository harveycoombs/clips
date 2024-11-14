import { FaXmark } from "react-icons/fa6";

interface Properties {
    children: React.ReactNode;
    classes?: string;
    title?: string;
    onClose?: any;
    [key: string]: any;
}

export default function Popup({ children, classes, title, onClose, ...rest }: Properties) {
    let classList = `p-2.5 rounded-md bg-white min-w-96 ${classes?.length ? " " + classes : ""}`;

    return (
        <div id="popup" className="fixed z-40 inset-0 w-full h-full grid place-items-center bg-slate-900 bg-opacity-70" onClick={(e: any) => {if (e.target.matches("#popup")) onClose() }}>
            <div className={classList} {...rest}>
                <div className="flex justify-between items-center mb-1">
                    <strong className="text-[0.9rem] select-none">{title}</strong>
                    <div className="text-slate-300 cursor-pointer text-lg duration-150 hover:text-slate-400" onClick={onClose}><FaXmark /></div>
                </div>{children}
            </div>
        </div>
    );
}