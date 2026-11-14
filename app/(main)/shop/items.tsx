"use client"

import { Crown, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { refillHearts } from "@/action/user-progress";
import { toast } from "sonner";
import { createStripeUrl } from "@/action/user-subscription";
import { POINTS_TO_REFILL } from "@/constants";

type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
};

export const Items = ({
    hearts,
    points,
    hasActiveSubscription,
}: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }

        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Щось пішло не так"));
        });
    };

    const onUpgrade = () => {
        startTransition(() => {
            createStripeUrl()
            .then((response) => {
                if (response.data) {
                    window.location.href = response.data;
                }
            })
            .catch(() => toast.error("Щось пішло не так"));
        });
    };

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Heart
                    className="size-[60px] shrink-0 text-rose-500"
                    fill="currentColor"
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Відновити серця
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={
                        pending
                        || hearts === 5 
                        || points < POINTS_TO_REFILL
                    }
                >
                    {hearts === 5
                    ? "Повні"
                    : (
                        <div className="flex items-center gap-x-1">
                            <Star
                                className="size-5"
                                fill="currentColor"
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )
                    }
                </Button>
            </div>
            <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                    <Crown
                        className="size-[60px] shrink-0 text-amber-500"
                        fill="currentColor"
                    />
                    <div className="flex-1">
                        <p className="text-neutral-700 text-base lg:text-xl font-bold">
                            Безлімітні серця
                        </p>
                    </div>
                    <Button
                        onClick={onUpgrade}
                        disabled={pending}
                    >
                        {hasActiveSubscription ? "налаштування" : "покращити"}
                    </Button>
            </div>
        </ul>
    );
};