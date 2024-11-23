"use client";
import { useState, useRef, useEffect } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import Button from "@/app/components/ui/button";
import Popup from "@/app/components/ui/popup";
import Field from "@/app/components/ui/field";
import TextBox from "@/app/components/ui/textbox";
import Label from "@/app/components/ui/label";

import { formatBytes, trimVideo } from "@/data/utils";
import { getCategories } from "@/data/posts";

interface Properties {
    onClose: any;
}

export default function Uploader({ onClose }: Properties) {
    let uploader = useRef<HTMLInputElement|null>(null);
    let [uploadedFile, setUploadedFile] = useState<File|null>(null);

    let [categories, setCategories] = useState<string[]>([]);
    let [categoriesAreLoading, setCategoriesLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setCategoriesLoading(true);

            let categoryList = await getCategories();
            setCategories(categoryList);

            setCategoriesLoading(false);
        })();
    }, []);

    let uploadSteps = [
        <div className="w-full h-[500px] border-2 border-slate-400 border-opacity-40 rounded-md border-dashed grid place-items-center" onDragOver={handleDragOverEvent} onDragEnter={handleDragOverEvent} onDragLeave={handleDragLeaveEvent} onDrop={handleDropEvent}>
            <div className="text-center select-none">
                <div className="w-fit mx-auto"><span className="text-sm font-medium text-slate-400/65 mr-3">Drop files here or</span><Button onClick={() => uploader?.current?.click()}>Browse</Button></div>
                <div className="w-fit mx-auto text-xs font-medium text-slate-400/65 mt-5">Supported formats: MP4, WEBM &amp; AVI</div>
            </div>            
            <input type="file" accept="video/mp4,video/x-m4v,video/webm,video/x-msvideo" className="hidden" ref={uploader} onChange={handleUpload} /></div>,
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

    let progressBar = useRef<HTMLProgressElement>(null);
    let percentageLabel = useRef<HTMLHeadingElement>(null);

    let startTimeField = useRef<HTMLInputElement>(null);
    let endTimeField = useRef<HTMLInputElement>(null);

    let uploadedVideo = useRef<HTMLVideoElement>(null);

    let [postTitle, setPostTitle] = useState<string>("");
    let [postCategory, setPostCategory] = useState<string>("");
    let [postDescription, setPostDescription] = useState<string>("");

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

            uploadedVideo.current.currentTime = start;
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
        setTrimLength(uploadedVideo?.current?.duration ?? 0);
    
        let reader = new FileReader();
        
        reader.addEventListener("load", () => {
            uploadSteps[1] = <div className="w-fit mx-auto flex flex-col items-center justify-center h-[500px]">
                <div className="flex justify-between items-center w-full mb-2">
                    <strong className="max-w-1/2 grow-0 text-wrap">{upload.name} <span className="text-slate-400/60">&ndash; {formatBytes(upload.size)}</span></strong>
                    <div><span className="font-semibold text-sm text-slate-400/60">Start:</span><Field readOnly={true} classes="w-20 ml-2 mr-3" small={true} ref={startTimeField} value="0:00" /><span className="font-semibold text-sm text-slate-400/60">End:</span><Field readOnly={true} classes="w-20 ml-2" small={true} ref={endTimeField} /></div>
                </div>
                <video src={reader.result?.toString()} ref={uploadedVideo} className="block bg-slate-50 rounded-md h-[420px] w-auto aspect-video overflow-hidden" controls></video>
                <div className="w-full box-border h-10 mt-2 bg-slate-100 rounded-md" ref={trimmerContainer} onMouseMove={trim} onMouseLeave={resetTrim} onMouseUp={resetTrim}>
                    <div className="border-blue-500 bg-blue-200 border-solid border-2 rounded-md h-full min-w-[40px] relative" ref={trimmerBar}>
                        <div className="w-3 absolute top-0 bottom-0 left-0 cursor-pointer grid place-items-center pl-2" onMouseDown={() => { leftTrimIsActive = true; }} onMouseUp={() => { leftTrimIsActive = false; }}><FaChevronLeft className="text-blue-500" /></div>
                        <div className="w-3 absolute top-0 bottom-0 right-0 cursor-pointer grid place-items-center pr-4" onMouseDown={() => { rightTrimIsActive = true; }} onMouseUp={() => { rightTrimIsActive = false; }}><FaChevronRight className="text-blue-500" /></div>
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
        onClose();
    }
    
    function setStep(n: number) {
        setCompletedUploadSteps(Array.from({ length: n }, (_, x) => n - x));
        setUploaderContent(uploadSteps[n - 1]);
    }
    
    function handleDragOverEvent(e: any) {
        e.preventDefault();
    
        e.target.classList.remove("border-slate-400", "border-opacity-40");
        e.target.classList.add("border-blue-500", "bg-blue-50");
    
        let uploaderMessage = e.target.querySelector("div > span");
        
        uploaderMessage?.classList?.remove("text-slate-400", "text-opacity-65");
        uploaderMessage?.classList?.add("text-blue-500");
    }
    
    function handleDragLeaveEvent(e: any) {
        e.target.classList.remove("border-blue-500", "bg-blue-50");
        e.target.classList.add("border-slate-400", "border-opacity-40");
    
        let uploaderMessage = e.target.querySelector("div > span");
    
        uploaderMessage?.classList?.remove("text-blue-500");
        uploaderMessage?.classList?.add("text-slate-400", "text-opacity-65");
    }
    
    function handleDropEvent(e: any) {
        e.preventDefault();
    
        if (uploader.current) {
            uploader.current.files = e.dataTransfer.files;
            uploader.current.dispatchEvent(new Event("change", { bubbles: true }));
    
            handleDragLeaveEvent(e);
        }
    }

    function updateProgressBar(e: any) {
        if (!e.lengthComputable) return;
    
        let progress = (e.loaded / e.total) * 100;
    
        if (progressBar.current && percentageLabel.current) {
            progressBar.current.value = progress;
            progressBar.current.innerHTML = `Publishing &middot; ${Math.round(progress)}%`;
            percentageLabel.current.innerHTML = `Publishing &middot; ${Math.round(progress)}% Complete`;
        }
    }
    
    async function publish() {
        if (!uploadedFile) return;
    
        uploadSteps[2] = <div className="w-full h-[500px] grid place-items-center"><strong className="block text-xl text-center text-slate-400 font-semibold select-none">
            <strong className="block font-semibold text-sm text-center text-slate-400/65" ref={percentageLabel}>Publishing &middot; 0% Complete</strong>
            <progress max="100" value="0" className="appearance-none w-96 h-3 mt-8"></progress>
            </strong></div>;
        setStep(3);
    
        let data = new FormData();
    
        let videoStart = trimStart ?? 0;
        let videoEnd = videoStart + (trimLength ?? 0);
    
        if (videoStart && videoEnd && trimLength) {
            let trimmedVideo = await trimVideo(window.location.origin, uploadedFile, videoStart, videoEnd, (progress: number) => {
                if (progressBar.current && percentageLabel.current) {
                    progressBar.current.value = progress;
                    percentageLabel.current.innerHTML = `Clipping &middot; ${Math.round(progress)}% Complete`;
                }
            });
        
            data.set("file", new File([trimmedVideo], uploadedFile.name, { type: uploadedFile.type }));
        } else {
            data.set("file", uploadedFile);
        }

        data.set("title", postTitle);
        data.set("description", postDescription);
        data.set("category", postCategory);
        data.set("start", videoStart.toString());
        data.set("end", videoEnd.toString());

        let request = new XMLHttpRequest();

        request.open("POST", "/api/upload", true);
        request.responseType = "json";

        request.upload.addEventListener("progress", updateProgressBar);

        request.addEventListener("readystatechange", (e: any) => {
            if (e.target.readyState != 4) return;        

            if (e.target.status != 200) {
                alert("Something went wrong. Please try again later.");
                return;
            }

            window.location.href = `/posts/${e.target.response.id}`;
        });

        request.send(data);
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
                <Field classes="w-full" onInput={(e: any) => setPostCategory(e.target.value)} list={categoriesAreLoading ? [] : categories} />
                <Label classes="w-full">Description</Label>
                <TextBox classes="w-full min-h-20 max-h-86 rounded-xl resize-horizontal" rows="6" onInput={(e: any) => setPostDescription(e.target.value)} />
            </div>
        </div>;
    
        setStep(3);
    }

    return (
        <Popup classes="w-1000" title="Upload a Clip" onClose={resetUploader}>
            <div className="flex gap-1.5 w-3/4 mx-auto mt-2 mb-4">
                <UploadStep number={1} title="Upload" completed={completedUploadSteps.indexOf(1) != -1} classes="rounded-l-full" />
                <UploadStep number={2} title="Edit" completed={completedUploadSteps.indexOf(2) != -1} />
                <UploadStep number={3} title="Publish" completed={completedUploadSteps.indexOf(3) != -1} classes="rounded-r-full" />
            </div>
            {uploaderContent}
            <div className="flex justify-between items-center mt-4">
                <Button classes="bg-red-500 hover:bg-red-600 active:bg-red-700" onClick={resetUploader}>Cancel Upload</Button>
                {(completedUploadSteps.length == 3) ? <Button onClick={publish}>Publish</Button> : <Button onClick={showPublishSection} classes={!uploadedFile ? "opacity-60 pointer-events-none" : ""} disabled={!uploadedFile}>Continue</Button>}
            </div>
        </Popup>
    );
}

function UploadStep(props: any) {
    let titleAppearance = props.completed ? "text-blue-500" : "text-slate-400/60";
    let barAppearance = props.completed ? "bg-blue-500" : "bg-slate-400/45";

    return (
        <div className="w-1/3 text-center" onClick={props.click}>
            <strong className={`text-sm select-none ${titleAppearance} font-semibold`}>{props.number}. {props.title}</strong>
            <div className={`h-1.5 w-full ${barAppearance} mt-2${props.classes?.length ? " " + props.classes : ""}`}></div>
        </div>
    );
}