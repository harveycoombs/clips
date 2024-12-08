"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";

import { FaCircleNotch } from "react-icons/fa6";

export default function LoginForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);

    let [disabled, setDisability] = useState<boolean>(false);

    let [button, setButton] = useState<React.JSX.Element>(<Button classes="block w-full mt-2.5">Continue</Button>);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setButton(<Button classes="block w-full mt-2.5 opacity-65 pointer-events-none">&nbsp;<FaCircleNotch className="animate-spin inline-block mx-auto text-base" />&nbsp;</Button>);
        setDisability(true);

        let credentials = new URLSearchParams({ email: email, password: password });

        try {  
            let response = await fetch("/api/sessions", {
                method: "POST",
                body: credentials
            });

            let json = await response.json();

            if (!json.success) {
                setErrorExistence(false);
                setWarningExistence(true);
                setDisability(false);

                setButton(<Button classes="block w-full mt-2.5">Continue</Button>);
                setFeedback(<div className="text-sm font-medium text-center text-amber-400">Invalid credentials</div>);

                return;
            }

            window.location.href = "/";
        } catch {
            setWarningExistence(false);
            setErrorExistence(true);
            setFeedback(<div className="text-sm font-medium text-center text-red-500">Something went wrong</div>);
        }
    }

    return (
        <form onSubmit={login}>
            {feedback}
            <Label error={errorExists} warning={warningExists}>Email Address</Label>
            <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="email" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setEmail(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />                    
            <Label error={errorExists} warning={warningExists}>Password</Label>
            <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setPassword(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            {button}
            <Button classes={`block w-full mt-2.5${disabled ? " pointer-events-none" : ""}`} disabled={disabled} transparent={true} url="/register">Register</Button>
        </form>
    );
}