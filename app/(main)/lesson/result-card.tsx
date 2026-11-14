import { Crown, Heart, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
    value: number | string;
    variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
    const isUnlimited = value === "∞";

    return (
        <div className={cn(
            "rounded-2xl border-2 w-full",
            variant === "points" && "bg-orange-400 border-orange-400",
            variant === "hearts" && "bg-rose-500 border-rose-500",
        )}>
            <div className={cn(
                "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
                variant === "hearts" && "bg-rose-500",
                variant === "points" && "bg-orange-400"
            )}>
                {variant === "hearts" ? "Залишилось" : "Загально XP"}
            </div>
            <div className={cn(
                "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
                variant === "hearts" && "text-rose-500",
                variant === "points" && "text-orange-400"
            )}>
                {variant === "points" && (
                    <Star className="size-[30px] mr-1.5" fill="currentColor" />
                )}
                {variant === "hearts" && !isUnlimited && (
                    <Heart className="size-[30px] mr-1.5" fill="currentColor" />
                )}
                {variant === "hearts" && isUnlimited && (
                    <Crown className="size-[30px] text-amber-500" fill="currentColor" />
                )}
                {!isUnlimited && value}
            </div>
        </div>
    );
};