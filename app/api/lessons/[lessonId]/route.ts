
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId } = await params;

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, Number(lessonId)),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId } = await params;
    const body = await req.json();

    const data = await db.update(lessons).set({
        ...body,
    }).where(eq(lessons.id, Number(lessonId))).returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId } = await params;

    const data = await db.delete(lessons)
        .where(eq(lessons.id, Number(lessonId)))
        .returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};
