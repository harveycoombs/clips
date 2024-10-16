import { NextResponse } from "next/server";

import { Users, JWT } from "@/data/users";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let email = data.get("email")?.toString();
    let password = data.get("password")?.toString();

    if (!email?.length) return NextResponse.json({ error: "Email address was not provided." }, { status: 400 });
    if (!password?.length) return NextResponse.json({ error: "Password was not provided." }, { status: 400 });

    let valid = await Users.verifyCredentials(email, password);
    if (!valid) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

    let user = await Users.getUser(email);
    if (!user) return NextResponse.json({ success: false }, { status: 500 });

    let credentials = JWT.create(user);

    let response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("token", credentials.token, {
        httpOnly: true,
        secure: true,
        maxAge: 3155760000
    });

    return response;
}