import { useState } from "react";

import Field from "../components/ui/field";
import Button from "../components/ui/button";

export default function Home() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");

    async function login(e: any) {
        e.preventDefault();

        let credentials = new URLSearchParams({ email: email, password: password });

        let response = await fetch("/api/sessions", {
            method: "POST",
            body: credentials
        })

        let json = await response.json();
    }

    return (
        <form onSubmit={login}>
            <label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Email Address</label>
            <Field classes="block w-full" type="email" onInput={(e: any) => setEmail(e.target.value)} />                    
            <label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Password</label>
            <Field classes="block w-full" type="password" onInput={(e: any) => setPassword(e.target.value)} />
            <Button classes="block w-full mt-2.5">Continue</Button>
            <Button classes="block w-full mt-2.5" transparent={true} url="/register">Register</Button>
        </form>
    );
}