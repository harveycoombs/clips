interface Properties {
    children: React.ReactNode;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ children, classes, error, warning, ...rest }: Properties) {
    let color;

    switch (true) {
        case error:
            color = "text-red-500";
            break;
        case warning:
            color = "text-amber-500";
            break;
        default:
            color = "text-slate-400";
            break;
    }

    let classList = `block text-xs font-medium ${color} select-none mt-2.5 mb-1`;

    return <label className={classList} {...rest}>{children}</label>;
}