"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader } from "lucide-react";

import {
  ClerkLoaded,
  ClerkLoading,
  Show,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ShapePhysics, type ShapePhysicsHandle } from "@/components/shape-physics";

const palette = [
  "#f5b82e", // жовтий
  "#f28a2e", // оранжевий
  "#e04545", // червоний
  "#4fbf6b", // зелений
  "#38bdf8", // синій (як primary-кнопки)
];

export default function Home() {
  const shapes = useRef<ShapePhysicsHandle>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative w-full flex-1 min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-10rem)] overflow-hidden">
      {/* Окремий блок на всю секцію: фігурки лягають на нижню лінію */}
      <div className="absolute inset-0">
        <ShapePhysics
          ref={shapes}
          background="#ffffff"
          colors={palette}
          shape="square"
          depth="2d"
          cursorFollowRatio={1}
          size={72}
          paused={paused}
          height="100%"
        />
      </div>

      {/* Кнопки керування фігурками */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="default" onClick={() => setPaused((p) => !p)}>
          {paused ? "Продовжити" : "Пауза"}
        </Button>
        <Button size="sm" variant="default" onClick={() => shapes.current?.addShape()}>
          Додати
        </Button>
        <Button size="sm" variant="default" onClick={() => shapes.current?.shake()}>
          Розтрусити
        </Button>
        <Button size="sm" variant="default" onClick={() => shapes.current?.clear()}>
          Очистити
        </Button>
        <Button size="sm" variant="default" onClick={() => shapes.current?.replay()}>
          Заново
        </Button>
      </div>

      {/* Біла картка по центру */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="pointer-events-auto w-full max-w-sm rounded-2xl border-2 bg-white p-8 shadow-sm flex flex-col items-center gap-y-6">
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-600 text-center">
            Практикуйте та опановуйте нові мови за допомогою LangLab.
          </h1>

          <div className="flex flex-col items-center gap-y-3 w-full">
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>

            <ClerkLoaded>
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg" variant="secondary" className="w-full">
                    Розпочати
                  </Button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <Button size="lg" variant="primaryOutline" className="w-full">
                    Я вже маю акаунт
                  </Button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <Link href="/learn">Продовжити</Link>
                </Button>
              </Show>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </section>
  );
}