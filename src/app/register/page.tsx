import Link from "next/link";

import Field from "@/app/components/ui/field";
import Button from "@/app/components/ui/button";

export default function Register() {
    return (
        <>
            <main className="h-screen grid place-items-center">
                <section className="w-64">
                    <Link href="/" className="block text-lg text-center select-none font-bold duration-150 hover:opacity-65"><span className="text-indigo-500">clips</span>.harveycoombs.com</Link>
                    <div className="text-sm text-center select-none font-medium text-slate-400 mt-1 mb-8">Create An Account</div>
<label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">First Name</label>
                    <Field classes="block w-full" />
<label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Last Name</label>
                    <Field classes="block w-full" />
                    <label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Email Address</label>
                    <Field classes="block w-full" type="email" />                                        <label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Password</label>
                    <Field classes="block w-full" type="password" />

                    <label className="block text-xs font-medium text-slate-400 select-none mt-2.5 mb-1">Confirm Password</label>
                    <Field classes="block w-full" type="password" />
                    <Button classes="block w-full mt-2.5">Continue</Button>
                    <Button classes="block w-full mt-2.5" transparent={true} url="/login">I Already Have an Account</Button>
                </section>
            </main>
        </>
    );
}