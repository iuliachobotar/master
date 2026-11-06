
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId } = await params;

    const data = await db.query.courses.findFirst({
        where: eq(courses.id, Number(courseId)),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId } = await params;
    const body = await req.json();

    const data = await db.update(courses).set({
        ...body,
    }).where(eq(courses.id, Number(courseId))).returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId } = await params;

    const data = await db.delete(courses)
        .where(eq(courses.id, Number(courseId)))
        .returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};
