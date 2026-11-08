"use client";

import { SaveButton, Toolbar, useNotify, useRefresh } from "react-admin";
import { useFormContext } from "react-hook-form";

export const CreateToolbar = ({ keep = [] }: { keep?: string[] }) => {
    const { reset } = useFormContext();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <Toolbar>
            <SaveButton label="Зберегти" />
            <SaveButton
                label="Зберегти й додати ще"
                type="button"
                variant="outlined"
                sx={{ ml: 2 }}
                mutationOptions={{
                    onSuccess: (data: any) => {
                        notify("Створено");
                        refresh();
                        const kept: Record<string, any> = {};
                        keep.forEach((k) => (kept[k] = data[k]));
                        reset(kept);
                    },
                }}
            />
        </Toolbar>
    );
};