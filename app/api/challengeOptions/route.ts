import { NextResponse } from "next/server";
import { and, asc, eq, inArray, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { challengeOptions, challenges, lessons, units } from "@/db/schema";
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
                challengeOptions.challengeId,
                db.select({ id: challenges.id }).from(challenges).where(
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
                )
            )
        );
    }

    if (filter.challengeId) {
        conditions.push(eq(challengeOptions.challengeId, Number(filter.challengeId)));
    }

    const data = await db
        .select()
        .from(challengeOptions)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(challengeOptions.id));

    return NextResponse.json(data, {
        headers: {
            "Content-Range": `challengeOptions 0-${data.length}/${data.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const data = await db.insert(challengeOptions).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0]);
};