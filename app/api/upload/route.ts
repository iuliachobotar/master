import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getIsAdmin } from "@/lib/admin";

export async function POST(req: Request) {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const kind = form.get("kind") === "audio" ? "audio" : "image";

    if (!file || !file.type.startsWith(`${kind}/`)) {
        return new NextResponse("Невірний тип файлу", { status: 400 });
    }

    const folder = kind === "audio" ? "audio" : "images";
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
}