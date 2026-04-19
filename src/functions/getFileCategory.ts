import type { FileCategory } from "@/types/file";

export const getFileCategory = (type: FileCategory | string, name: string): FileCategory => {
    type = type?.toLowerCase() || "";
    name = name?.toLowerCase() || "";

    if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) {
        return "image";
    }

    if (type.startsWith("video/") || /\.(mp4|mov|avi|mkv)$/.test(name)) {
        return "video";
    }

    if (type.startsWith("audio/") || /\.(mp3|wav|aac)$/.test(name)) {
        return "audio";
    }

    if (type === "application/pdf" || name.endsWith(".pdf")) {
        return "pdf";
    }

    if (type.startsWith("text/") || /\.(txt|json|xml|log)$/.test(name)) {
        return "text";
    }

    if (/\.(zip|rar|7z)$/.test(name)) {
        return "archive";
    }

    return "unknown";
};