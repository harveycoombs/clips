import cookie from "cookie";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faUserGroup, faRobot, faMagnifyingGlass, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import Button from "./ui/button";

interface Properties {
    current: string;
    token?: string;
}

export default function Header({ current, token }: Properties) {
    let options = <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    //<div><Button classes="inline-block align-middle mr-4">Upload</Button><HeaderNavigationItem icon={faEllipsis} margin={false} /></div>

    let userAvatar = null;
    //<Link href="/users/1" title="View Your Profile" className="inline-block align-middle mx-6 cursor-pointer duration-150 hover:opacity-65"><Image src="/uploads/avatars/1" alt="Harvey Coombs" width={26} height={26} className="block aspect-square rounded-full object-cover" /></Link>;

    return (
        <header className="p-3">
            <div className="w-[800px] mx-auto flex justify-between items-center">
                Token = {token}
                <Link href="/" className="font-bold text-slate-800 select-none" draggable="false"><span className="text-indigo-500">clips</span>.harveycoombs.com</Link>
                <nav>
                    <HeaderNavigationItem icon={faBorderAll} url="/" selected={current == "feed"} margin={true} />
                    <HeaderNavigationItem icon={faUserGroup} url="/users" selected={current == "users"} margin={true} />
                    <HeaderNavigationItem icon={faRobot} url="/ai" selected={current == "ai"} margin={true} />
                    <HeaderNavigationItem icon={faMagnifyingGlass} margin={true} />
                    {userAvatar}
                </nav>
                {options}
            </div>
        </header>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.margin ? "mx-6" : ""} text-xl ${props.selected ? "text-indigo-500" : "text-slate-300"} cursor-pointer duration-150${props.selected ? " hover:text-indigo-600" : " hover:text-slate-400"}`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}><FontAwesomeIcon icon={props.icon} /></Link> : <div className={classList} draggable={false}><FontAwesomeIcon icon={props.icon} /></div>;
}

export function getServerSideProps(context: any) {
    let { request } = context;
    let cookies = request.headers.cookie;
  
    let value: string|undefined;
  
    if (cookies) {
      let parsed = cookie.parse(cookies);
      value = parsed.token;
    }
  
    return {
        props: {
            token: value
        }
    };
}