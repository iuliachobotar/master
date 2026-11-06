
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ challengeId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId } = await params;

    const data = await db.query.challenges.findFirst({
        where: eq(challenges.id, Number(challengeId)),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ challengeId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId } = await params;
    const body = await req.json();

    const data = await db.update(challenges).set({
        ...body,
    }).where(eq(challenges.id, Number(challengeId))).returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ challengeId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId } = await params;

    const data = await db.delete(challenges)
        .where(eq(challenges.id, Number(challengeId)))
        .returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};
