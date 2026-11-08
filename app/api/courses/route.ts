import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.select().from(courses).orderBy(asc(courses.id));

    return NextResponse.json(data, {
        headers: {
            "Content-Range": `courses 0-${data.length}/${data.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const data = await db.insert(courses).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0]);
};