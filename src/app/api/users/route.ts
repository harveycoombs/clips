import { NextResponse } from "next/server";

import { createUser, emailExists, getUser, verifyCredentials } from "@/data/users";
import { createJWT } from "@/data/jwt";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let firstName = data.get("firstname")?.toString();
    let lastName = data.get("lastname")?.toString();
    let email = data.get("email")?.toString();
    let password = data.get("password")?.toString();

    if (!firstName?.length || !lastName?.length || !email?.length || !password?.length) return NextResponse.json({ error: "One or more fields were not provided." }, { status: 400 });
    
    let emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) return NextResponse.json({ error: "Email already exists." }, { status: 409 });

    let userid = await createUser(firstName, lastName, email, password);
    if (!userid) return NextResponse.json({ error: "Unable to create user." }, { status: 500 });


    let valid = await verifyCredentials(email, password);
    if (!valid) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

    let user = await getUser(email);
    if (!user) return NextResponse.json({ error: "Unable to fetch newly created user." }, { status: 500 });

    let credentials = createJWT(user);

    let response = NextResponse.json({ userid: userid }, { status: 200 });

    response.cookies.set("token", credentials.token, {
        httpOnly: true,
        secure: true,
        maxAge: 3155760000
    });

    return response;
}