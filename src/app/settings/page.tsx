import { cookies } from "next/headers";

import Header from "@/app/components/header";
import Settings from "@/app/components/settings";

import { authenticate } from "@/data/jwt";

export default async function SettingsPage() {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    return (
        <>
            <Header user={currentSessionUser} />
            <main className="h-[calc(100vh-110px)] w-1000 mx-auto overflow-auto">
                <Settings />
            </main>
        </>
    );
}