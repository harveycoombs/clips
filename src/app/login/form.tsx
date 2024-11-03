"use client";
import { useState } from "react";

import Field from "@/app/components/ui/field";
import Label from "@/app/components/ui/label";
import Button from "@/app/components/ui/button";

export default function LoginForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setErrorExistence(false);

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
            <Field classes="block w-full" type="email" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setEmail(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />                    
            <Label error={errorExists} warning={warningExists}>Password</Label>
            <Field classes="block w-full" type="password" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setPassword(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            <Button classes="block w-full mt-2.5">Continue</Button>
            <Button classes="block w-full mt-2.5" transparent={true} url="/register">Register</Button>
        </form>
    );
}