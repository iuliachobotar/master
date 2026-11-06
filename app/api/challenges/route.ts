import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
    if (!(await getIsAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.challenges.findMany();

    return NextResponse.json(data);
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