"use client";
import { useState, useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faUserGroup, faRobot, faMagnifyingGlass, faEllipsis, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";
import TextBox from "@/app/components/ui/textbox";
import Label from "@/app/components/ui/label";
import Popup from "@/app/components/ui/popup";

import { Utils } from "@/data/utils";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface Properties {
    current: string;
    user?: any;
}

export default function Header({ current, user }: Properties) {
    let [searchAreaIsVisible, setSearchAreaVisibility] = useState<boolean>(false);
    let [uploadPopupIsVisible, setUploadPopupVisibility] = useState<boolean>(false);

    let [optionsAreVisible, setOptionsVisibility] = useState<boolean>(false);

    let uploader = useRef<HTMLInputElement>(null);
    let [uploadedFile, setUploadedFile] = useState<File|null>(null);

    let uploadSteps = [
        <div className="w-full h-[500px] border-2 border-slate-400 border-opacity-40 rounded-md border-dashed grid place-items-center" onDragOver={handleDragOverEvent} onDragEnter={handleDragOverEvent} onDragLeave={handleDragLeaveEvent} onDrop={handleDropEvent}><div><span className="text-sm font-medium text-slate-400 text-opacity-65 mr-3">Drop files here or</span><Button onClick={() => uploader?.current?.click()}>Browse</Button></div><input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" ref={uploader} onChange={handleUpload} /></div>,
        <div className="w-full h-[500px] grid place-items-center"><strong className="text-amber-500 font-medium">Please upload a video to continue</strong></div>,
        <div className="w-full h-[500px]">Publish Your Video</div>
    ];

    let [uploaderContent, setUploaderContent] = useState<React.JSX.Element>(uploadSteps[0]);
    let [completedUploadSteps, setCompletedUploadSteps] = useState<number[]>([1]);

    let [trimStart, setTrimStart] = useState<number>(0);
    let [trimLength, setTrimLength] = useState<number>(0);

    let trimmerContainer = useRef<HTMLDivElement>(null);
    let trimmerBar = useRef<HTMLDivElement>(null);

    let leftTrimIsActive = false;
    let rightTrimIsActive = false;

    let previousLeftPosition = 0;
    let previousTrimmerWidth = 0;

    let percentageLabel = useRef<HTMLElement>(null);

    let startTimeField = useRef<HTMLInputElement>(null);
    let endTimeField = useRef<HTMLInputElement>(null);

    let uploadedVideo = useRef<HTMLVideoElement>(null);

    let [postTitle, setPostTitle] = useState<string>("");
    let [postCategory, setPostCategory] = useState<string>("");
    let [postDescription, setPostDescription] = useState<string>("");
    
    let accountOptions = optionsAreVisible ? <div className="w-full absolute top-[120%] border-[1px] border-slate-400 border-opacity-60 rounded-md overflow-hidden select-none"><Link href="/settings" className="block px-2 py-1 text-[0.825rem] font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100">Settings</Link><div className="block px-2 py-1 border-t-[1px] border-slate-400 border-opacity-60 text-[0.825rem] text-red-500 font-medium cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100" onClick={logout}>Log Out</div></div> : null;
    let options = user ? <div className="relative"><Button classes="inline-block align-middle mr-4" onClick={() => setUploadPopupVisibility(true)}>Upload</Button><HeaderNavigationItem icon={faEllipsis} margin={false} click={() => setOptionsVisibility(!optionsAreVisible)} />{accountOptions}</div> : <div><Button classes="inline-block align-middle" url="/login">Log In</Button><Button classes="inline-block align-middle ml-1" url="/register" transparent={true}>Register</Button></div>;
    let userAvatar = user ? <Link href={`/users/${user.userid}`} title="View Your Profile" className="inline-block align-middle mx-6 cursor-pointer duration-150 hover:opacity-65"><Image src={`/uploads/avatars/${user.userid}`} alt={`${user.firstname} ${user.lastname}`} width={26} height={26} className="block aspect-square rounded-full object-cover" /></Link> : null;

    async function logout() {
        let response = await fetch("/api/sessions", { method: "DELETE" });

        if (response.ok) {
            window.location.href = "/";
        }
    }

    function trim(e: any) {
        if ((!leftTrimIsActive && !rightTrimIsActive) || !trimmerContainer?.current || !trimmerBar?.current) return;

        let position = leftTrimIsActive ? (e.clientX - trimmerContainer.current.offsetLeft) : previousLeftPosition;
        let width = previousTrimmerWidth ? previousTrimmerWidth : (leftTrimIsActive ? (trimmerContainer.current.clientWidth - position) : ((e.clientX - trimmerContainer.current.offsetLeft) - previousLeftPosition));

        if (position >= trimmerContainer.current.clientWidth) return;

        trimmerBar.current.setAttribute("style", `width: ${width}px; left: ${position}px;`);

        previousLeftPosition = position;

        if (uploadedVideo?.current) {
            let start = uploadedVideo.current.duration * (previousLeftPosition / trimmerContainer.current.clientWidth);
            let length = uploadedVideo.current.duration * ( trimmerBar.current.clientWidth / trimmerContainer.current.clientWidth);

            setTrimStart(start);
            setTrimLength(length);

            if (startTimeField?.current && endTimeField?.current) {
                let startMinutes = Math.round((start / 60) - ((start / 60) % 60));
                let startSeconds = Math.round(start % 60);

                let lengthMinutes =  Math.round(((start + length) / 60) - (((start + length) / 60) % 60));
                let lengthSeconds = Math.round((start + length) % 60);

                startTimeField.current.value = `${startMinutes < 10 ? "0" : ""}${startMinutes}:${startSeconds < 10 ? "0" : ""}${startSeconds}`;
                endTimeField.current.value = `${lengthMinutes < 10 ? "0" : ""}${lengthMinutes}:${lengthSeconds < 10 ? "0" : ""}${lengthSeconds}`;
            }
        }
    }

    function resetTrim() {
        leftTrimIsActive = false;
        rightTrimIsActive = false;
    }

    function handleUpload(e: any) {
        let upload = e.target.files[0];

        if (!upload.type.startsWith("video")) {
            setStep(2);
            return;
        }

        setUploadedFile(upload);

        let reader = new FileReader();
        
        reader.addEventListener("load", () => {
            uploadSteps[1] = <div className="w-fit mx-auto flex flex-col items-center justify-center h-[500px]">
                <div className="flex justify-between items-center w-full mb-2">
                    <strong className="max-w-1/2 grow-0 text-wrap">{upload.name} <span className="text-slate-400 text-opacity-60">&ndash; {Utils.formatBytes(upload.size)}</span></strong>
                    <div><span className="font-semibold text-sm text-slate-400 text-opacity-60">Start:</span><Field readOnly={true} classes="w-20 ml-2 mr-3" small={true} ref={startTimeField} value="0:00" /><span className="font-semibold text-sm text-slate-400 text-opacity-60">End:</span><Field readOnly={true} classes="w-20 ml-2" small={true} ref={endTimeField} /></div>
                </div>
                <video src={reader.result?.toString()} ref={uploadedVideo} className="block bg-slate-50 rounded-md h-[420px] w-auto aspect-video overflow-hidden" controls></video>
                <div className="w-full box-border h-10 mt-2 bg-slate-100 rounded-md" ref={trimmerContainer} onMouseMove={trim} onMouseLeave={resetTrim} onMouseUp={resetTrim}>
                    <div className="border-indigo-500 bg-indigo-200 border-solid border-2 rounded-md h-full min-w-[40px] relative" ref={trimmerBar}>
                        <div className="w-3 absolute top-0 bottom-0 left-0 cursor-pointer grid place-items-center pl-2" onMouseDown={() => { leftTrimIsActive = true; }} onMouseUp={() => { leftTrimIsActive = false; }}><FontAwesomeIcon icon={faChevronLeft} className="text-indigo-500" /></div>
                        <div className="w-3 absolute top-0 bottom-0 right-0 cursor-pointer grid place-items-center pr-4" onMouseDown={() => { rightTrimIsActive = true; }} onMouseUp={() => { rightTrimIsActive = false; }}><FontAwesomeIcon icon={faChevronRight} className="text-indigo-500" /></div>
                    </div>
                </div>
            </div>;

            setStep(2);

            if (endTimeField?.current && uploadedVideo?.current) {
                endTimeField.current.value = uploadedVideo.current.duration.toString();
            }
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

    function handleDragOverEvent(e: any) {
        e.preventDefault();

        e.target.classList.remove("border-slate-400", "border-opacity-40");
        e.target.classList.add("border-indigo-500", "bg-indigo-50");

        let uploaderMessage = e.target.querySelector("div > span");
        
        uploaderMessage.classList.remove("text-slate-400", "text-opacity-65");
        uploaderMessage.classList.add("text-indigo-500");
    }
    
    function handleDragLeaveEvent(e: any) {
        e.target.classList.remove("border-indigo-500", "bg-indigo-50");
        e.target.classList.add("border-slate-400", "border-opacity-40");
    
        let uploaderMessage = e.target.querySelector("div > span");

        uploaderMessage.classList.remove("text-indigo-500");
        uploaderMessage.classList.add("text-slate-400", "text-opacity-65");
    }

    function handleDropEvent(e: any) {
        e.preventDefault();

        if (uploader.current) {
            uploader.current.files = e.dataTransfer.files;
            uploader.current.dispatchEvent(new Event("change", { bubbles: true }));

            handleDragLeaveEvent(e);
        }
    }

    async function trimVideo(video: File, start: number, end: number): Promise<Blob> {
        let ffmpeg = new FFmpeg();

        await ffmpeg.load({
            coreURL: `${window.location.origin}/ffmpeg-core.js`,
            wasmURL: `${window.location.origin}/ffmpeg-core.wasm`,
            workerURL: `${window.location.origin}/ffmpeg-core.worker.js`
        });
    
        try {
            let inputName = `input.${video.type.substring(video.type.indexOf("/"))}`;
            let outputName = `output.${video.type.substring(video.type.indexOf("/"))}`;
    
            await ffmpeg.writeFile(inputName, await fetchFile(video));
    
            await ffmpeg.exec([
                "-i", inputName,
                "-ss", Math.round(start).toString(),
                "-t", Math.round(end - start).toString(),
                "-c", 'copy',
                outputName
            ]);
    
            let data = await ffmpeg.readFile(outputName);
    
            return new Blob([data], { type: video.type ?? "video/mp4" });
        } finally {
            ffmpeg.terminate();
        }
    }

    async function publish() {
        if (!uploadedFile) return;

        uploadSteps[2] = <div className="w-full h-[500px] grid place-items-center"><strong className="block text-xl text-center text-slate-400 font-semibold select-none" ref={percentageLabel}>Publishing...</strong></div>;
        setStep(3);

        let data = new FormData();

        let videoStart = trimStart ?? 0;
        let videoEnd = videoStart + (trimLength ?? 0);

        let trimmedVideo = await trimVideo(uploadedFile, videoStart, videoEnd);

        data.set("file", trimmedVideo);
        data.set("title", postTitle);
        data.set("description", postDescription);
        data.set("category", postCategory);
        data.set("start", videoStart.toString());
        data.set("end", videoEnd.toString());

        let response = await fetch("/api/upload", {
            method: "POST",
            body: data
        });

        if (!response.ok) {
            alert("Something went wrong.");
            return;
        }

        let json = await response.json();
        window.location.href = `/posts/${json.id}`;
    }

    function showPublishSection() {
        let data = uploadedVideo?.current?.src;

        uploadSteps[2] = <div className="w-full h-[500px] flex gap-8">
            <div className="w-1/2 bg-slate-50 rounded-md">
                <video src={data} className="h-full mx-auto"></video>
            </div>
            <div className="w-1/2">
                <Label classes="w-full">Title</Label>
                <Field classes="w-full" onInput={(e: any) => setPostTitle(e.target.value)} />
                <Label classes="w-full">Category</Label>
                <Field classes="w-full" onInput={(e: any) => setPostCategory(e.target.value)} />
                <Label classes="w-full">Description</Label>
                <TextBox classes="w-full min-h-20 max-h-86 rounded-xl resize-horizontal" rows="6" onInput={(e: any) => setPostDescription(e.target.value)} />
            </div>
        </div>;

        setStep(3);
    }

    return (
        <>
            <header className="p-3">
                <div className="w-[840px] mx-auto flex justify-between items-center h-">
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
                    {(completedUploadSteps.length == 3) ? <Button onClick={publish}>Publish</Button> : <Button onClick={showPublishSection}>Continue</Button>}
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