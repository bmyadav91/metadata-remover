// Define your allowed output types
export type SupportedExtension = "JPEG" | "PNG" | "WEBP";

// 2. Map MIME types to your supported formats
const FILE_MIME_MAP: Record<string, SupportedExtension> = {
    "image/jpeg": "JPEG",
    "image/jpg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
};

export const getFileExtension = (fileType: string): SupportedExtension | undefined => {
    if (!fileType) return undefined;

    // Normalize to lowercase to handle "IMAGE/JPEG" or "Image/Jpeg"
    const normalizedType = fileType.toLowerCase().trim();

    // Use a safety check to see if the key exists
    if (normalizedType in FILE_MIME_MAP) {
        return FILE_MIME_MAP[normalizedType];
    }

    // Default fallback if it's an image but not in our specific map
    if (normalizedType.startsWith("image/")) {
        return "JPEG";
    }

    return undefined;
};


export const getExtensionFromPath = (input?: string | null): string | null => {
    if (!input) return null;

    const fileName = input.split('/').pop()?.split('?')[0];
    if (!fileName || !fileName.includes('.')) return null;

    return fileName.split('.').pop()?.toLowerCase() || null;
};