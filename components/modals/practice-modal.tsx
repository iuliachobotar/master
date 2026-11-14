"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {usePracticeModal } from "@/store/use-practice-modal";


export const PracticeModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = usePracticeModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Heart
                            className="size-[100px] text-rose-500"
                            fill="currentColor"
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Практичне заняття
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Використовуйте тренувальні уроки, щоб відновити серця та бали. Під час тренувальних уроків неможливо їх втратити.                    
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4 bg-white">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button 
                        variant="primary" 
                        className="w-full" 
                        size="lg"
                        onClick={close}
                        >
                            Я розумію
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};