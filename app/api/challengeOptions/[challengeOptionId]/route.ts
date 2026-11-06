
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId } = await params;

    const data = await db.query.challengeOptions.findFirst({
        where: eq(challengeOptions.id, Number(challengeOptionId)),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId } = await params;
    const body = await req.json();

    const data = await db.update(challengeOptions).set({
        ...body,
    }).where(eq(challengeOptions.id, Number(challengeOptionId))).returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId } = await params;

    const data = await db.delete(challengeOptions)
        .where(eq(challengeOptions.id, Number(challengeOptionId)))
        .returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};
