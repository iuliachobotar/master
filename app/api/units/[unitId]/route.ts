
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ unitId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { unitId } = await params;

    const data = await db.query.units.findFirst({
        where: eq(units.id, Number(unitId)),
    });

    if (!data) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ unitId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { unitId } = await params;
    const body = await req.json();

    const data = await db.update(units).set({
        ...body,
    }).where(eq(units.id, Number(unitId))).returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ unitId: string }> }
) => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const { unitId } = await params;

    const data = await db.delete(units)
        .where(eq(units.id, Number(unitId)))
        .returning();

    if (!data.length) {
        return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data[0]);
};
