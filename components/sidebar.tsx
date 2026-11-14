import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { SidebarItem } from "./sidebar-item";

import {
    ClerkLoading,
    ClerkLoaded,
    UserButton
} from "@clerk/nextjs";

import { GraduationCap, Loader, ShoppingBag, Target, Trophy } from "lucide-react";

type Props = {
    className?: string;
};

export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
            className,
            )}>
                <Link href="">
            <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                <Image
                    src="/mascot.svg"
                    height={40}
                    width={40}
                    alt="Logo"
                />
            
                <h1 className="text-2xl font-medium text-green-600 tracking-wide">
                    LangLab
                    </h1>
            </div>
                </Link>
                <div className="flex flex-col gap-y-2 flex-1">
                    <SidebarItem 
                    label="Навчання" 
                    href="/learn" 
                    icon={<GraduationCap className="size-6" strokeWidth={2.5} />}
                    />

                    <SidebarItem 
                    label="Таблиця лідерів" 
                    href="/leaderboard" 
                    icon={<Trophy className="size-6" strokeWidth={2.5} />}
                    />

                    <SidebarItem 
                    label="Квести" 
                    href="/quests" 
                    icon={<Target className="size-6" strokeWidth={2.5} />}
                    />

                    <SidebarItem 
                    label="Магазин" 
                    href="/shop" 
                    icon={<ShoppingBag className="size-6" strokeWidth={2.5} />}
                    />
                </div>
                <div className="p-4">
                    <ClerkLoading>
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton />
                    </ClerkLoaded>
                </div>
        </div>
    );
};