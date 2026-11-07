"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useAudio, useKey } from "react-use";

import { cn } from "@/lib/utils";

type FlipCardData = {
    id: number;
    word: string;        // англійське слово (лицьова сторона)
    translation: string; // український переклад (зворотна сторона)
    imageSrc: string | null;
    audioSrc: string | null;
};

type Props = {
    cards: FlipCardData[];
    onComplete: () => void;
};

export const FlipChallenge = ({ cards, onComplete }: Props) => {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const completedRef = useRef(false);

    const current = cards[index];

    const [audio, , controls] = useAudio({ src: current?.audioSrc || "" });

    const flip = useCallback(() => {
        if (!current) return;

        setFlipped((prev) => !prev);
    }, [current]);

    const goTo = useCallback((nextIndex: number) => {
        if (nextIndex < 0 || nextIndex >= cards.length) return;

        setIndex(nextIndex);
        setFlipped(false);
    }, [cards.length]);

    const prev = useCallback(() => goTo(index - 1), [goTo, index]);
    // На останній картці кнопка «вправо» завершає урок
    const next = useCallback(() => {
        if (index === cards.length - 1) {
            if (completedRef.current) return;
            completedRef.current = true;
            onComplete();
            return;
        }
        goTo(index + 1);
    }, [goTo, index, cards.length, onComplete]);

    // Клавіатура: ← → перемикають картки, пропуск перевертає
    useKey("ArrowLeft", prev, {}, [prev]);
    useKey("ArrowRight", next, {}, [next]);
    useKey(" ", (e) => {
        e.preventDefault();
        flip();
    }, {}, [flip]);

    if (!current) return null;

    const isFirst = index === 0;
    const isLast = index === cards.length - 1;

    return (
        <div className="flex flex-col items-center gap-y-6">
            {audio}

            {/* key перемонтовує картку при перемиканні, тому переклад не "блимає" під час анімації */}
            <div
                key={current.id}
                className="w-full max-w-md h-[260px] lg:h-[300px] [perspective:1200px]"
            >
                <div
                    role="button"
                    tabIndex={0}
                    aria-label={flipped ? current.translation : current.word}
                    onClick={flip}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") flip();
                    }}
                    className={cn(
                        "relative h-full w-full cursor-pointer outline-none",
                        "transition-transform duration-500 ease-in-out motion-reduce:transition-none",
                        "[transform-style:preserve-3d]",
                        flipped && "[transform:rotateY(180deg)]",
                    )}
                >
                    {/* Лицьова сторона — англійське слово */}
                    <div
                        className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center gap-y-4",
                            "rounded-xl border-2 border-b-4 bg-white p-6",
                            "[backface-visibility:hidden]",
                        )}
                    >
                        {current.imageSrc && (
                            <div className="relative h-24 w-24 lg:h-32 lg:w-32">
                                <Image
                                    src={current.imageSrc}
                                    fill
                                    alt={current.word}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <p className="text-2xl lg:text-4xl font-bold text-neutral-700 text-center">
                            {current.word}
                        </p>
                        {current.audioSrc && (
                            <button
                                type="button"
                                aria-label="Прослухати"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    controls.play();
                                }}
                                className="absolute right-3 top-3 rounded-lg p-2 text-sky-500 hover:bg-sky-100"
                            >
                                <Volume2 className="h-5 w-5" />
                            </button>
                        )}
                        <span className="absolute bottom-3 text-xs lg:text-sm text-neutral-400">
                            Натисни, щоб побачити переклад
                        </span>
                    </div>

                    {/* Зворотна сторона — український переклад */}
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center",
                            "rounded-xl border-2 border-b-4 border-sky-300 bg-sky-100 p-6",
                            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        )}
                    >
                        <p className="text-2xl lg:text-4xl font-bold text-sky-500 text-center">
                            {current.translation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Навігація */}
            <div className="flex items-center gap-x-6">
                <button
                    type="button"
                    aria-label="Попередня картка"
                    onClick={prev}
                    disabled={isFirst}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl border-2 border-b-4",
                        "text-neutral-600 hover:bg-black/5 active:border-b-2",
                        "disabled:pointer-events-none disabled:opacity-40",
                    )}
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <span className="min-w-[60px] text-center text-sm lg:text-base font-semibold text-neutral-500">
                    {index + 1} / {cards.length}
                </span>

                <button
                    type="button"
                    aria-label={isLast ? "Завершити урок" : "Наступна картка"}
                    onClick={next}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl border-2 border-b-4",
                        "text-neutral-600 hover:bg-black/5 active:border-b-2",
                    )}
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};