"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "react-use";

import { cn } from "@/lib/utils";
import { Card } from "./card";

type Stage = {
  text: string;
  audioSrc?: string | null; // аудіо цієї частини, напр. "/es_robot_p2.mp3"
  done?: boolean; // уже написано в попередньому челенджі: показуємо зеленим, не набираємо
};

type Props = {
  imageSrc?: string | null;
  audioSrc?: string | null; // запасне аудіо для першої частини
  cardText?: string; // текст під іконкою в картці, напр. "el robot"
  stages: Stage[];
  disabled?: boolean;
  onComplete: () => void; // після останньої частини
};

// Порівнюємо без урахування регістру й наголосів,
// щоб "é" можна було набрати як "e" на будь-якій клавіатурі.
const normalize = (c: string) =>
  c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Відділяє розділові знаки в кінці: "El robot es malo." -> core "El robot es malo", tail "."
const splitTail = (text: string) => {
  const m = text.match(/^(.*?)([.,!?;:…]*)$/);
  return { core: m?.[1] ?? text, tail: m?.[2] ?? "" };
};

type BlockProps = {
  text: string;
  tail: string;
  pos: number;
  active: boolean;
  complete: boolean;
  wrong: boolean;
};

const Block = ({ text, tail, pos, active, complete, wrong }: BlockProps) => {
  const words = text.split(" ");
  let offset = 0;

  return (
    <div className="flex flex-wrap items-end justify-center gap-y-4">
      {words.map((word, wi) => {
        const start = offset;
        offset += word.length + 1; // +1 за пробіл
        const spaceIndex = start + word.length;
        const isLastWord = wi === words.length - 1;

        return (
          <div key={wi} className="flex items-end">
            <div className="flex">
              {word.split("").map((ch, ci) => {
                const i = start + ci;
                const state = complete
                  ? "done"
                  : !active
                  ? "ghost"
                  : i < pos
                  ? "typed"
                  : i === pos
                  ? "current"
                  : "ghost";

                return (
                  <span
                    key={ci}
                    className={cn(
                      "mx-0.5 inline-flex min-w-[2rem] justify-center border-b-4 pb-1 text-4xl font-bold transition-colors",
                      // набрана літера: темна, повна видимість
                      state === "typed" &&
                        "border-neutral-400 text-neutral-800",
                      // ще не набрана: напівпрозора
                      state === "ghost" &&
                        "border-neutral-300 text-neutral-800/25",
                      // та, яку пишемо зараз: блимає синя лінія
                      state === "current" &&
                        "animate-pulse border-blue-500 text-neutral-800/25",
                      // блок дописано
                      state === "done" &&
                        "border-emerald-500 text-emerald-500",
                      // помилка
                      state === "current" &&
                        wrong &&
                        "animate-none border-rose-500 text-rose-500/50"
                    )}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>

            {/* крапка (чи інший знак) в кінці: стабільна, без підкреслення, не набирається */}
            {isLastWord && tail && (
              <span
                className={cn(
                  "mx-0.5 inline-flex border-b-4 border-transparent pb-1 text-4xl font-bold transition-colors",
                  complete ? "text-emerald-500" : "text-neutral-800"
                )}
              >
                {tail}
              </span>
            )}

            {/* пробіл між словами: без лінії, лише курсор, коли черга на ньому */}
            {!isLastWord && (
              <div className="flex h-12 w-5 items-end justify-center pb-1">
                {active && !complete && spaceIndex === pos && (
                  <span
                    className={cn(
                      "h-1 w-3 animate-pulse rounded bg-blue-500",
                      wrong && "animate-none bg-rose-500"
                    )}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TypingChallenge = ({
  imageSrc,
  audioSrc,
  cardText,
  stages,
  disabled,
  onComplete,
}: Props) => {
  // починаємо з першої ще не написаної частини
  const [stageIndex, setStageIndex] = useState(() => {
    const i = stages.findIndex((s) => !s.done);
    return i === -1 ? 0 : i;
  });
  const [pos, setPos] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [finished, setFinished] = useState(false);

  const [okAudio, , okControls] = useAudio({ src: "/key.mp3" });
  const [errorAudio, , errorControls] = useAudio({ src: "/error.mp3" });

  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = stages.map((s) => splitTail(s.text));
  const current = parsed[stageIndex];

  // Аудіо поточної частини (для першої є запасний варіант з пропса audioSrc)
  const stageAudioSrc = stages[stageIndex]?.audioSrc ?? audioSrc ?? null;

  useEffect(() => {
    inputRef.current?.focus();
  }, [stageIndex]);

  // Автоплей один раз при появі кожної частини.
  // Далі користувач повторює вручну (клавіша 1 / клік по картці).
  useEffect(() => {
    if (!stageAudioSrc) return;

    const audio = new Audio(stageAudioSrc);
    audio.addEventListener("error", () =>
      console.warn("Не вдалося завантажити аудіо:", stageAudioSrc)
    );
    audio.play().catch((err) =>
      console.warn("Автоплей не спрацював:", stageAudioSrc, err)
    );

    return () => {
      audio.pause();
    };
  }, [stageAudioSrc, stageIndex]);

  const playOk = () => {
    okControls.seek(0);
    okControls.play();
  };

  const playError = () => {
    errorControls.seek(0);
    errorControls.play();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value.slice(-1);
    e.target.value = ""; // завжди очищаємо, читаємо лише останній символ

    if (disabled || finished || !current || !typed) return;

    const expected = current.core[pos];

    // клавіша "1" озвучує картку (це робить Card), тож тут її ігноруємо
    if (typed === "1" && expected !== "1") return;

    if (normalize(typed) !== normalize(expected)) {
      playError();
      setWrong(true);
      setTimeout(() => setWrong(false), 250);
      return;
    }

    playOk();
    const next = pos + 1;

    if (next < current.core.length) {
      setPos(next);
      return;
    }

    // частину дописано
    if (stageIndex + 1 < stages.length) {
      setStageIndex((i) => i + 1);
      setPos(0);
    } else {
      setPos(next);
      setFinished(true);
      setTimeout(onComplete, 600);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-y-8"
      onClick={() => inputRef.current?.focus()}
    >
      {okAudio}
      {errorAudio}

      {/* та сама картка, що й в інших челенджах: іконка, текст і цифра 1 */}
      {imageSrc && (
        <div className="w-[220px] lg:w-[260px]">
          <Card
            key={stageIndex} // новий екземпляр картки для кожної частини: свіже аудіо для клавіші 1
            id={0}
            imageSrc={imageSrc}
            audioSrc={stageAudioSrc} // аудіо поточної частини
            text={cardText ?? ""}
            shortcut="1"
            onClick={() => inputRef.current?.focus()}
            type="TYPE"
          />
        </div>
      )}

      {stages.map(
        (stage, i) =>
          i <= stageIndex && (
            <Block
              key={i}
              text={parsed[i].core}
              tail={parsed[i].tail}
              pos={pos}
              active={i === stageIndex}
              complete={i < stageIndex || (finished && i === stageIndex)}
              wrong={wrong}
            />
          )
      )}

      {/* прихований input: ловить клавіатуру і на десктопі, і на телефоні */}
      <input
        ref={inputRef}
        onChange={handleInput}
        autoFocus
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
    </div>
  );
};