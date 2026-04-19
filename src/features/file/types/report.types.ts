export type ProcessedFileResult = {
    originalUri: string,

    newUri?: string,
    newName?: string;
    newSize?: number;

    status: "success" | "error";
    error?: string;
};