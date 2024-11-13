import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import * as fs from "fs/promises";

import { createPost } from "@/data/posts";
import { authenticate } from "@/data/jwt";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let file = data.get("file");
    
    if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = token?.length ? await authenticate(token) : null;

    let userid = currentSessionUser.userid;
    let title = data.get("title")?.toString();
    let description = data.get("description")?.toString() ?? "";
    let category = data.get("category")?.toString() ?? "";
    
    if (!userid) return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    if (!title?.length) return NextResponse.json({ error: "Invalid title." }, { status: 400 });

    let id = await createPost(userid, title, description, category);

    try {
        await fs.mkdir(`./uploads/posts/${id}`);

        let buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(`./uploads/posts/${id}/video.mp4`, new Uint8Array(buffer));
    } catch (ex: any) {
        return NextResponse.json({ error: ex.message }, { status: 500 });
    }

    return NextResponse.json({ id: id }, { status: 200 });
}