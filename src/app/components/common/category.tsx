interface Properties {
    name: string;
    [key: string]: any;
}

export default function Category({ name, ...rest }: Properties) {
    return <div key={name} className="w-fit bg-blue-200 bg-opacity-70 text-blue-500 select-none font-semibold text-xs py-2 px-3 leading-[0.9em] rounded-full cursor-pointer" {...rest}>{name}</div>
}