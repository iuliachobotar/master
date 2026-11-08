import { NextResponse } from "next/server";
import { and, asc, eq, inArray } from "drizzle-orm";

import db from "@/db/drizzle";
import { lessons, units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = JSON.parse(searchParams.get("filter") ?? "{}");

    const conditions = [];

    if (filter.courseId) {
        conditions.push(
            inArray(
                lessons.unitId,
                db.select({ id: units.id }).from(units)
                    .where(eq(units.courseId, Number(filter.courseId)))
            )
        );
    }

    if (filter.unitId) {
        conditions.push(eq(lessons.unitId, Number(filter.unitId)));
    }

    const data = await db
        .select()
        .from(lessons)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(lessons.order), asc(lessons.id));

    return NextResponse.json(data, {
        headers: {
            "Content-Range": `lessons 0-${data.length}/${data.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const data = await db.insert(lessons).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0]);
};