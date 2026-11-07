import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
//@ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.courses);
        await db.delete(schema.units);
        await db.delete(schema.userProgress);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.userSubscription);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "/es.svg",
            },
            {
                id: 2,
                title: "Italian",
                imageSrc: "/it.svg",
            },
            {
                id: 3,
                title: "French",
                imageSrc: "/fr.svg",
            },
            {
                id: 4,
                title: "Croatian",
                imageSrc: "/hr.svg",
            },
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1,
                title: "Розділ 1",
                description: "Вивчіть основи іспанської мови",
                order: 1,
            },
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 7,
                unitId: 1,
                order: 1, 
                title: "Flip",
            },
            {
                id: 6,
                unitId: 1,
                order: 2, 
                title: "Robot",
            },
            {
                id: 1,
                unitId: 1,
                order: 3, 
                title: "Nouns",
            },
            {
                id: 2,
                unitId: 1,
                order: 4, 
                title: "Verbs",
            },
            {
                id: 3,
                unitId: 1,
                order: 5, 
                title: "Verbs",
            },
            {
                id: 4,
                unitId: 1,
                order: 6, 
                title: "Verbs",
            },
            {
                id: 5,
                unitId: 1,
                order: 7, 
                title: "Verbs",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonsId: 1, 
                type: "SELECT",
                order: 1,
                question: 'Which one of these is the "the man"?',
            },
            {
                id: 2,
                lessonsId: 1, 
                type: "ASSIST",
                order: 2,
                question: '"the man"',
            },
            {
                id: 3,
                lessonsId: 1, 
                type: "SELECT",
                order: 3,
                question: 'Which one of these is the "the robot"?',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1, 
                imageSrc: "/man.svg",
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/woman.svg",
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/robot.svg",
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2, 
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3, 
                imageSrc: "/man.svg",
                correct: false,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/woman.svg",
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/robot.svg",
                correct: true,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonsId: 2,
                type: "ASSIST",
                order: 1,
                question: '"the woman"',
            },
            {
                id: 5,
                lessonsId: 2,
                type: "SELECT",
                order: 2,
                question: 'Which one of these is "the woman"?',
            },
            {
                id: 6,
                lessonsId: 2,
                type: "ASSIST",
                order: 3,
                question: '"the man"',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 4,
                correct: false,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 4,
                correct: true,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 4,
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

            {
                challengeId: 5,
                imageSrc: "/man.svg",
                correct: false,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 5,
                imageSrc: "/woman.svg",
                correct: true,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 5,
                imageSrc: "/robot.svg",
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

            {
                challengeId: 6,
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 6,
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 6,
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 7,
                lessonsId: 6,
                type: "TYPE",
                order: 1,
                question: "Type what you see",
            },
            {
                id: 8,
                lessonsId: 6,
                type: "TYPE",
                order: 2,
                question: "Type what you see",
            },
        ]);

        await db.insert(schema.challengeOptions).values([

            {
                challengeId: 7,
                imageSrc: "/robot.svg",
                correct: true,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },

            {
                challengeId: 8,
                imageSrc: "/robot.svg",
                correct: false,
                text: "el robot",
                audioSrc: "/es_robot.mp3",
            },
            {
                challengeId: 8,
                correct: true, 
                text: "El robot es malo.",
                audioSrc: "/es_robot_p2.mp3",
            },
        ]);


        await db.insert(schema.challenges).values([
            {
                id: 9,
                lessonsId: 7,
                type: "FLIP",
                order: 1,
                question: "Вивчи нові слова",
            },
        ]);


        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 9,
                text: "la mujer",
                translation: "жінка",
                correct: true,
            },
            {
                challengeId: 9,
                text: "el hombre",
                translation: "чоловік",
                correct: true,
            },
            {
                challengeId: 9,
                text: "el robot",
                translation: "робот",
                correct: true,
            },
        ]);

        console.log("Заповнення завершено");
    } catch (error) {
        console.error(error);
        throw new Error("Не вдалося заповнити базу даних");
    }
};

main();