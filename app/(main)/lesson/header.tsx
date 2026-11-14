import { Crown, Heart, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
    hearts: number;
    percentage: number;
    hasActiveSubscription: boolean;
};

export const Header = ({
    hearts,
    percentage,
    hasActiveSubscription,
}: Props) => {
    const { open } = useExitModal();

    return (
        <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
            <X
                onClick={open}
                className="text-slate-500 hover:opacity-75 transition cursor-pointer"
            />
            <Progress value={percentage}/>
            {hasActiveSubscription ? (
                <div className="text-amber-500 flex items-center font-bold">
                    <Crown className="size-7" fill="currentColor" />
                </div>
            ) : (
                <div className="text-rose-500 flex items-center font-bold">
                    <Heart className="size-7 mr-2" fill="currentColor" />
                    {hearts}
                </div>
            )}
        </header>
    );
};