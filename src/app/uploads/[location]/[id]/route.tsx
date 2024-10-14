import { NextResponse } from "next/server";
import fs from "fs/promises";
import mime from "mime";

export async function GET(_: any, { params }: any) {
    let { location, id } = params;
    let files: string[] = [];

    try {
        files = await fs.readdir(`./uploads/${location}/${id}`);
    } catch {
        return NextResponse.json({ error: "The specified upload does not exist." }, { status: 404 });
    }

    files = files.filter(file => file != "." && file != "..");

    if (!files.length) return NextResponse.json({ error: "The specified upload does not exist." }, { status: 404 });

    let content = await fs.readFile(`./uploads/${location}/${id}/${files[0]}`);

    return new NextResponse(content, {
        headers: {
            "Content-Type": mime.getType(`./uploads/${location}/${id}/${files[0]}`) ?? "application/octet-stream"
        }
    });
}