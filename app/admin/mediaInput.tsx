"use client";

import { useRef, useState } from "react";
import { useInput } from "react-admin";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = { source: string; label?: string; kind: "image" | "audio" };

export const MediaInput = ({ source, label, kind }: Props) => {
    const { field } = useInput({ source });
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith(`${kind}/`)) {
            setError(kind === "image" ? "Оберіть файл-зображення" : "Оберіть аудіофайл");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const body = new FormData();
            body.append("file", file);
            body.append("kind", kind);
            const res = await fetch("/api/upload", { method: "POST", body });
            if (!res.ok) throw new Error(await res.text());
            const { url } = await res.json();
            field.onChange(url);
        } catch (err) {
            console.error("UPLOAD ERROR:", err);
            setError("Не вдалося завантажити файл");
        } finally {
            setLoading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const onRemove = () => {
        field.onChange(null);
        setError(null);
    };

    return (
        <Box sx={{ mb: 2, width: "100%" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
            <input
                ref={inputRef}
                type="file"
                hidden
                accept={kind === "image" ? "image/*" : "audio/*"}
                onChange={onFile}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                >
                    {loading ? "Завантаження..." : field.value ? "Замінити файл" : "Обрати файл"}
                </Button>
                {field.value && (
                    <IconButton
                        color="error"
                        onClick={onRemove}
                        disabled={loading}
                        title="Прибрати файл"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            {field.value && kind === "image" && (
                <Box component="img" src={field.value} sx={{ display: "block", mt: 1, maxHeight: 120 }} />
            )}
            {field.value && kind === "audio" && (
                <audio controls src={field.value} style={{ display: "block", marginTop: 8 }} />
            )}
            {error && <Typography color="error" variant="caption">{error}</Typography>}
        </Box>
    );
};