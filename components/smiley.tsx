"use client";

import { useEffect, useRef } from "react";

type Props = {
    variant?: "happy" | "sad" | "bad";
    size?: number;
    className?: string;
};

const colors = {
    happy: "#4fbf6b", // зелений
    sad: "#f5b82e", // жовтий
    bad: "#e04545", // червоний
} as const;

// Параметри квадрата такі самі, як на головній сторінці
const SCALE = 43.7; // розмір одиниці тіла в одиницях SVG
const BODY = 0.93; // радіус «обличчя» в одиницях тіла
const SPREAD = 0.2;
const HALF_W = 0.09;
const HALF_H = 0.2;
const MAX_TURN = 0.85;
const SEGMENTS = 7;

// Контур ока-капсули
const outline: [number, number][] = (() => {
    const straight = Math.max(0, HALF_H - HALF_W);
    const pts: [number, number][] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
        const a = Math.PI + (Math.PI * i) / SEGMENTS;
        pts.push([Math.cos(a) * HALF_W, -straight + Math.sin(a) * HALF_W]);
    }
    for (let i = 0; i <= SEGMENTS; i++) {
        const a = (Math.PI * i) / SEGMENTS;
        pts.push([Math.cos(a) * HALF_W, straight + Math.sin(a) * HALF_W]);
    }
    return pts;
})();

// Обличчя як вигнута поверхня: очі повертаються до напрямку погляду
const eyePaths = (lookX: number, lookY: number, open: number): [string, string] => {
    const len = Math.hypot(lookX, lookY);
    if (len > 1) {
        lookX /= len;
        lookY /= len;
    }
    const m = Math.hypot(lookX, lookY);
    const angle = m * MAX_TURN;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const axis = m || 1;
    const kx = -lookY / axis;
    const ky = lookX / axis;

    const build = (side: number) =>
        outline
            .map(([ox, oy], i) => {
                const u = (side * SPREAD + ox) / BODY;
                const v = (oy * open) / BODY;
                const rho = Math.hypot(u, v);
                const f = rho > 1e-9 ? Math.sin(rho) / rho : 1;
                const sx = u * f;
                const sy = v * f;
                const sz = Math.cos(rho);
                const dot = kx * sx + ky * sy;
                const X = sx * cos + ky * sz * sin + kx * dot * (1 - cos);
                const Y = sy * cos - kx * sz * sin + ky * dot * (1 - cos);
                const x = 50 + BODY * SCALE * X;
                const y = 50 + BODY * SCALE * Y;
                return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
            })
            .join(" ") + " Z";

    return [build(-1), build(1)];
};

export const Smiley = ({ variant = "happy", size = 80, className }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const leftRef = useRef<SVGPathElement>(null);
    const rightRef = useRef<SVGPathElement>(null);
    const initial = eyePaths(0, 0, 1);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        let pointer: { x: number; y: number } | null = null;
        const onMove = (e: PointerEvent) => {
            pointer = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("pointermove", onMove);

        let lx = 0;
        let ly = 0;
        let raf = 0;
        let blinkAt = performance.now() + 2000 + Math.random() * 3000;
        const BLINK_MS = 160;

        const frame = (now: number) => {
            let tx = 0;
            let ty = 0;

            if (pointer) {
                const r = svg.getBoundingClientRect();
                const dx = pointer.x - (r.left + r.width / 2);
                const dy = pointer.y - (r.top + r.height / 2);
                const d = Math.hypot(dx, dy) || 1;
                const strength = Math.min(1, d / 150);
                tx = (dx / d) * strength;
                ty = (dy / d) * strength;
            }

            // Плавне наздоганяння курсора
            lx += (tx - lx) * 0.18;
            ly += (ty - ly) * 0.18;

            // Кліпання
            let open = 1;
            if (now >= blinkAt) {
                const t = (now - blinkAt) / BLINK_MS;
                if (t >= 1) {
                    blinkAt = now + 2500 + Math.random() * 3500;
                } else {
                    open = Math.max(0.08, Math.abs(1 - 2 * t));
                }
            }

            const [left, right] = eyePaths(lx, ly, open);
            leftRef.current?.setAttribute("d", left);
            rightRef.current?.setAttribute("d", right);

            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
            role="img"
            aria-label="Смайлик"
        >
            <rect x="6" y="6" width="88" height="88" rx="20" fill={colors[variant]} />
            <path ref={leftRef} d={initial[0]} fill="#fff" />
            <path ref={rightRef} d={initial[1]} fill="#fff" />
        </svg>
    );
};