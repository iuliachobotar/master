import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { asc, eq, inArray, ne } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const sourceId = Number(process.argv[2]);
const replace = process.argv.includes("--replace");

const clearCourse = async (courseId: number) => {
    const units = await db.select().from(schema.units)
        .where(eq(schema.units.courseId, courseId));
    if (!units.length) return;

    const unitIds = units.map((u) => u.id);
    const lessons = await db.select().from(schema.lessons)
        .where(inArray(schema.lessons.unitId, unitIds));
    const lessonIds = lessons.map((l) => l.id);

    if (lessonIds.length) {
        const challenges = await db.select().from(schema.challenges)
            .where(inArray(schema.challenges.lessonsId, lessonIds));
        const challengeIds = challenges.map((c) => c.id);

        if (challengeIds.length) {
            await db.delete(schema.challengeOptions)
                .where(inArray(schema.challengeOptions.challengeId, challengeIds));
            await db.delete(schema.challenges)
                .where(inArray(schema.challenges.id, challengeIds));
        }
        await db.delete(schema.lessons)
            .where(inArray(schema.lessons.id, lessonIds));
    }
    await db.delete(schema.units).where(inArray(schema.units.id, unitIds));
};

const cloneInto = async (targetId: number) => {
    const units = await db.select().from(schema.units)
        .where(eq(schema.units.courseId, sourceId))
        .orderBy(asc(schema.units.order), asc(schema.units.id));

    let u = 0, l = 0, c = 0, o = 0;

    for (const unit of units) {
        const { id: _u, ...unitData } = unit;
        const [newUnit] = await db.insert(schema.units)
            .values({ ...unitData, courseId: targetId }).returning();
        u++;

        const lessons = await db.select().from(schema.lessons)
            .where(eq(schema.lessons.unitId, unit.id))
            .orderBy(asc(schema.lessons.order), asc(schema.lessons.id));

        for (const lesson of lessons) {
            const { id: _l, ...lessonData } = lesson;
            const [newLesson] = await db.insert(schema.lessons)
                .values({ ...lessonData, unitId: newUnit.id }).returning();
            l++;

            const challenges = await db.select().from(schema.challenges)
                .where(eq(schema.challenges.lessonsId, lesson.id))
                .orderBy(asc(schema.challenges.order), asc(schema.challenges.id));

            for (const challenge of challenges) {
                const { id: _c, ...challengeData } = challenge;
                const [newChallenge] = await db.insert(schema.challenges)
                    .values({ ...challengeData, lessonsId: newLesson.id }).returning();
                c++;

                const options = await db.select().from(schema.challengeOptions)
                    .where(eq(schema.challengeOptions.challengeId, challenge.id))
                    .orderBy(asc(schema.challengeOptions.id));

                for (const option of options) {
                    const { id: _o, ...optionData } = option;
                    await db.insert(schema.challengeOptions)
                        .values({ ...optionData, challengeId: newChallenge.id });
                    o++;
                }
            }
        }
    }
    return { u, l, c, o };
};

const main = async () => {
    if (!sourceId) {
        console.log("Використання: npx tsx scripts/clone-all.ts <ID_англійського_курсу> [--replace]");
        return;
    }

    const targets = await db.select().from(schema.courses)
        .where(ne(schema.courses.id, sourceId))
        .orderBy(asc(schema.courses.id));

    for (const target of targets) {
        const existing = await db.select().from(schema.units)
            .where(eq(schema.units.courseId, target.id));

        if (existing.length > 0 && !replace) {
            console.log(`Пропускаю "${target.title}" (ID ${target.id}): там уже є ${existing.length} юніт(ів). Додайте --replace, щоб замінити.`);
            continue;
        }

        if (existing.length > 0) await clearCourse(target.id);

        const r = await cloneInto(target.id);
        console.log(`"${target.title}" (ID ${target.id}): юнітів ${r.u}, уроків ${r.l}, завдань ${r.c}, опцій ${r.o}.`);
    }
};

main().catch((err) => {
    console.error("Помилка:", err);
    process.exit(1);
});