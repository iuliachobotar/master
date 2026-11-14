import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Crown, Heart, Star } from "lucide-react";
import { courses } from "@/db/schema";

type Props = {
    activeCourse: typeof courses.$inferSelect;
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;

}

export const UserProgress = ({ 
    activeCourse, 
    points, 
    hearts, 
    hasActiveSubscription 
}: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href="/courses">
                <Button variant="ghost">
                    <Image
                        src={activeCourse.imageSrc}
                        alt={activeCourse.title}
                        className="rounded-md border"
                        width={32}
                        height={32}
                    />
                </Button>
            </Link>
            <Link href="/shop">
                <Button variant="ghost" className="text-orange-500">
                    <Star className="size-7 mr-2" fill="currentColor" />
                    {points}
                </Button>
            </Link>
            <Link href="/shop">
                {hasActiveSubscription ? (
                    <Button variant="ghost" className="text-amber-500">
                        <Crown className="size-7" fill="currentColor" />
                    </Button>
                ) : (
                    <Button variant="ghost" className="text-rose-500">
                        <Heart className="size-7 mr-2" fill="currentColor" />
                        {hearts}
                    </Button>
                )}
            </Link>
        </div>
    );
};