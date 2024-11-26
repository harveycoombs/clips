import { cookies } from "next/headers";

import Header from "@/app/components/header";
import Settings from "@/app/components/settings";

import { authenticate } from "@/data/jwt";
import { getUserDetails, getUserSettings } from "@/data/users";

export default async function SettingsPage() {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    if (!currentSessionUser?.userid) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    let userDetails = await getUserDetails(currentSessionUser.userid);
    let userSettings = await getUserSettings(currentSessionUser.userid);

    return (
        <>
            <Header user={currentSessionUser} />
            <main className="h-[calc(100vh-110px)] w-1200 mx-auto overflow-auto">
                <Settings user={userDetails} settings={userSettings} />
            </main>
        </>
    );
}