import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = JSON.parse(searchParams.get("filter") ?? "{}");

    const data = await db
        .select()
        .from(units)
        .where(filter.courseId ? eq(units.courseId, Number(filter.courseId)) : undefined)
        .orderBy(asc(units.order), asc(units.id));

    return NextResponse.json(data, {
        headers: {
            "Content-Range": `units 0-${data.length}/${data.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const data = await db.insert(units).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0]);
};