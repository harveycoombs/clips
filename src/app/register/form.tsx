"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";

export default function RegistrationForm() {
    let [email, setEmail] = useState<string>("");
    let [firstName, setFirstName] = useState<string>("");
    let [lastName, setLastName] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    let [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setFeedback(null);
        setErrorExistence(false);

        if (password != passwordConfirmation) {
            setFeedback(<div className="text-sm font-medium text-center text-amber-400">Passwords do not match</div>);
            setErrorExistence(true);
            return;
        }

        let credentials = new URLSearchParams({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password
        });

        let response = await fetch("/api/users", {
            method: "POST",
            body: credentials
        });

        switch (response.status) {
            case 200:
                setErrorExistence(false);
                setWarningExistence(false);

                let json = await response.json();
                window.location.href = "/";
                break;
            case 409:
                setErrorExistence(false);
                setWarningExistence(true);

                setFeedback(<div className="text-sm font-medium text-center text-amber-400">Email already exists</div>);
                break;
            default:
                setWarningExistence(false);
                setErrorExistence(true);

                setFeedback(<div className="text-sm font-medium text-center text-red-500">Something went wrong</div>);
                break;
        }
    }

    return (
        <form onSubmit={login}>
            {feedback}
            <Label classes="block w-full" error={errorExists} warning={warningExists}>First Name</Label>
            <Field classes="block w-full" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setFirstName(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            <Label classes="block w-full" error={errorExists} warning={warningExists}>Last Name</Label>
            <Field classes="block w-full" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setLastName(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            <Label classes="block w-full" error={errorExists} warning={warningExists}>Email Address</Label>
            <Field classes="block w-full" type="email" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setEmail(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />                                        
            <Label classes="block w-full" error={errorExists} warning={warningExists}>Password</Label>
            <Field classes="block w-full" type="password" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setPassword(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            <Label classes="block w-full" error={errorExists} warning={warningExists}>Confirm Password</Label>
            <Field classes="block w-full" type="password" error={errorExists} warning={warningExists} onInput={(e: any) => {
                setPasswordConfirmation(e.target.value);
                setErrorExistence(false);
                setWarningExistence(false);
                setFeedback(null);
            }} />
            <Button classes="block w-full mt-2.5">Continue</Button>
            <Button classes="block w-full mt-2.5" transparent={true} url="/login">I Already Have an Account</Button>
        </form>
    );
}