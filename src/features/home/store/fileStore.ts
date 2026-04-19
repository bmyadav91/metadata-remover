import { create } from "zustand";
import { fileType } from "@/types/file";


interface fileState {
    files: fileType[];

    setFiles: (files: fileType[]) => void;
    setClear: () => void;
}

export const useFileStore = create<fileState>((set) => ({
    files: [],
    setFiles: (files) =>
        set({ files }),

    setClear: () =>
        set({ files: [] }),
}));