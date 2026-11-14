import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Promo = () => {
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Crown
                        className="size-[26px] text-yellow-500 fill-yellow-500"
                        strokeWidth={2}
                    />
                    <h3 className="font-bold text-lg">
                        Перейти на Pro
                    </h3>
                </div>
                <p className="text-muted-foreground">
                    Отримайте необмежену кількість сердечок!
                </p>
            </div>

            <Button
                asChild
                variant="super"
                className="w-full"
                size="lg"
            >
                <Link href="/shop">
                    Покращити сьогодні
                </Link>
            </Button>
        </div>
    );
};