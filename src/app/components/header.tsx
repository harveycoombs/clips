"use client";
import { useState, useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faUserGroup, faRobot, faMagnifyingGlass, faEllipsis, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";
import Popup from "@/app/components/ui/popup";

interface Properties {
    current: string;
    user?: any;
}

export default function Header({ current, user }: Properties) {
    let [searchAreaIsVisible, setSearchAreaVisibility] = useState<boolean>(false);
    let [uploadPopupIsVisible, setUploadPopupVisibility] = useState<boolean>(false);

    let uploader = useRef<HTMLInputElement>(null);

    let uploadSteps = [
        <div className="w-full h-[500px] border-2 border-slate-400 border-opacity-40 rounded-md border-dashed grid place-items-center"><div><span className="text-sm font-medium text-slate-400 text-opacity-65 mr-3">Drop files here or</span><Button onClick={() => uploader?.current?.click()}>Browse</Button></div><input type="file" className="hidden" ref={uploader} onChange={handleUpload} /></div>,
        <div className="w-full h-[500px] grid place-items-center"><strong className="text-amber-500 font-medium">Please upload a video to continue</strong></div>,
        <div className="w-full h-[500px]">Publish Your Video</div>
    ];

    let [uploaderContent, setUploaderContent] = useState<React.JSX.Element>(uploadSteps[0]);
    let [completedUploadSteps, setCompletedUploadSteps] = useState<number[]>([1]);

    let options = user ? <div><Button classes="inline-block align-middle mr-4" onClick={() => setUploadPopupVisibility(true)}>Upload</Button><HeaderNavigationItem icon={faEllipsis} margin={false} /></div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.userid}`} title="View Your Profile" className="inline-block align-middle mx-6 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={26} height={26} className="block aspect-square rounded-full object-cover" /></Link> : null;

    function handleUpload(e: any) {
        let upload = e.target.files[0];

        let reader = new FileReader();
        
        reader.addEventListener("load", () => {
            uploadSteps[1] = <div className="w-full h-[500px]"><div>
            <video src={reader.result?.toString()} className="block rounded-md h-[400px] w-auto aspect-video"></video>
            </div></div>;

            setStep(2);
        });

        reader.readAsDataURL(upload);
    }

    function resetUploader() {
        setUploaderContent(uploadSteps[0]);
        setCompletedUploadSteps([1]);
        setUploadPopupVisibility(false);
    }

    function setStep(n: number) {
        setCompletedUploadSteps(Array.from({ length: n }, (_, x) => n - x));
        setUploaderContent(uploadSteps[n - 1]);
    }

    return (
        <>
            <header className="p-3">
                <div className="w-[840px] mx-auto flex justify-between items-center">
                    <Link href="/" className="font-bold text-slate-800 select-none duration-150 hover:opacity-65" draggable="false"><span className="text-indigo-500">clips</span>.harveycoombs.com</Link>
                    <nav>
                        <HeaderNavigationItem icon={faBorderAll} url="/" selected={current == "feed"} margin={true} />
                        <HeaderNavigationItem icon={faUserGroup} url="/users" selected={current == "users"} margin={true} />
                        <HeaderNavigationItem icon={faRobot} url="/ai" selected={current == "ai"} margin={true} />
                        <HeaderNavigationItem icon={faMagnifyingGlass} margin={true} selected={searchAreaIsVisible} click={() => setSearchAreaVisibility(!searchAreaIsVisible)} />
                        {userAvatar}
                    </nav>
                    {options}
                </div>
            </header>
            {searchAreaIsVisible ? <div className="w-[840px] mx-auto">
                <Field button={{ text: "Search", click: () => alert("Search was performed") }} classes="mb-3" placeholder="Search..." />
            </div>: null}
            {uploadPopupIsVisible ? <Popup classes="w-[70rem]" title="Upload a Clip" onClose={resetUploader}>
                <div className="flex gap-1.5 w-3/4 mx-auto mt-2 mb-4">
                    <UploadStep number={1} title="Upload" completed={completedUploadSteps.indexOf(1) != -1} classes="rounded-l-full" click={() => setStep(1)} />
                    <UploadStep number={2} title="Edit" completed={completedUploadSteps.indexOf(2) != -1} click={() => setStep(2)} />
                    <UploadStep number={3} title="Publish" completed={completedUploadSteps.indexOf(3) != -1} classes="rounded-r-full" click={() => setStep(3)} />
                </div>
                {uploaderContent}
                <div className="flex justify-between items-center mt-4">
                    <Button classes="bg-red-500 hover:bg-red-600 active:bg-red-700" onClick={resetUploader}>Cancel Upload</Button>
                    <Button classes={(completedUploadSteps.length < 3) ? "opacity-60 pointer-events-none" : ""} disabled={completedUploadSteps.length < 3}>Publish</Button>
                </div>
            </Popup> : null}
        </>
    );
}

function HeaderNavigationItem(props: any) {
    let classList = `inline-block align-middle ${props.margin ? "mx-6" : ""} text-xl ${props.selected ? "text-indigo-500" : "text-slate-300"} cursor-pointer duration-150${props.selected ? " hover:text-indigo-600" : " hover:text-slate-400"}`;
    return props.url?.length ? <Link href={props.url} className={classList} draggable={false}><FontAwesomeIcon icon={props.icon} /></Link> : <div className={classList} draggable={false} onClick={props.click}><FontAwesomeIcon icon={props.icon} /></div>;
}

function UploadStep(props: any) {
    let titleAppearance = props.completed ? "text-indigo-500" : "text-slate-400 text-opacity-60";
    let barAppearance = props.completed ? "bg-indigo-500" : "bg-slate-400 bg-opacity-45";

    return (
        <div className="w-1/3 text-center cursor-pointer" onClick={props.click}>
            <strong className={`text-sm select-none ${titleAppearance} font-semibold`}>{props.number}. {props.title}</strong>
            <div className={`h-1.5 w-full ${barAppearance} mt-2${props.classes?.length ? " " + props.classes : ""}`}></div>
        </div>
    );
}