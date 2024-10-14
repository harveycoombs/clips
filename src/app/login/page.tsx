import Link from "next/link";

import LoginForm from "./form";

export default function Home() {
    return (
        <>
            <main className="h-screen grid place-items-center">
                <section className="w-64">
                    <Link href="/" className="block text-lg text-center select-none font-bold duration-150 hover:opacity-65"><span className="text-indigo-500">clips</span>.harveycoombs.com</Link>
                    <div className="text-sm text-center select-none font-medium text-slate-400 mt-1 mb-8">Log In to Your Account</div>
                    <LoginForm />
                </section>
            </main>
        </>
    );
}