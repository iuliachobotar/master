import { NextResponse } from "next/server";
import { and, asc, eq, inArray, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { challenges, lessons, units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = JSON.parse(searchParams.get("filter") ?? "{}");

    const conditions: SQL[] = [];

    if (filter.courseId) {
        conditions.push(
            inArray(
                challenges.lessonsId,
                db.select({ id: lessons.id }).from(lessons).where(
                    inArray(
                        lessons.unitId,
                        db.select({ id: units.id }).from(units)
                            .where(eq(units.courseId, Number(filter.courseId)))
                    )
                )
            )
        );
    }

    if (filter.lessonsId) {
        conditions.push(eq(challenges.lessonsId, Number(filter.lessonsId)));
    }

    const data = await db
        .select()
        .from(challenges)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(challenges.order), asc(challenges.id));

    return NextResponse.json(data, {
        headers: {
            "Content-Range": `challenges 0-${data.length}/${data.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();

        const data = await db.insert(challenges).values({
            question: body.question,
            type: body.type,
            lessonsId: Number(body.lessonsId),
            order: Number(body.order),
        }).returning();

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error("CREATE CHALLENGE ERROR:", error);

        return NextResponse.json(
            { error: "Failed to create challenge" },
            { status: 500 }
        );
    }
};