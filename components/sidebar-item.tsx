"use client";

import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";


type Props = {
    label: string;
    icon: ReactNode;
    href: string;
};

export const SidebarItem = ({
    label,
    icon,
    href,
}: Props) => {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Button
            variant={active ? "sidebarOutline" : "sidebar"}
            className="justify-start h-[52px]"
        >
            <Link href={href} className="flex items-center">
            <span className="mr-5">{icon}</span>
            {label}
            </Link>
        </Button>
    )
}