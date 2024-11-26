import { NextResponse } from "next/server";

import * as fs from "fs/promises";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let file = data.get("file");
    let postid = parseInt(data.get("id")?.toString() ?? "0");
    
    if (!file || !(file instanceof File)) return NextResponse.json({ success: false, error: "No file was uploaded." }, { status: 400 });

    if (!postid) return NextResponse.json({ success: false, error: "Invalid post ID." }, { status: 400 });
    
    try {
        await fs.mkdir(`./uploads/thumbnails/${postid}`);

        let buffer = Buffer.from(await file.arrayBuffer());

        await fs.writeFile(`./uploads/posts/${postid}/${file.name}`, new Uint8Array(buffer));
    } catch (ex: any) {
        return NextResponse.json({ success: false, error: ex.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}