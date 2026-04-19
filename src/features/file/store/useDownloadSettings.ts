import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/infrastructure/storage/zustandStorage';

// type 
import type { DownloadSettingsType } from "@/types/donwloadSettings";

type DownloadSettings = DownloadSettingsType & {
    setWidth: (val: string) => void;
    setHeight: (val: string) => void;
    setQuality: (val: string) => void;
    setRemoveMetadata: (val: boolean) => void;

    reset: () => void;
};

const DEFAULTS = {
    width: "",
    height: "",
    quality: "100",
    removeMetadata: true,
};

export const useDownloadSettingsStore = create<DownloadSettings>()(
    persist(
        (set) => ({
            ...DEFAULTS,

            setWidth: (val) => set({ width: val }),
            setHeight: (val) => set({ height: val }),
            setQuality: (val) => set({ quality: val }),
            setRemoveMetadata: (val) => set({ removeMetadata: val }),

            reset: () => set({ ...DEFAULTS }),
        }),
        {
            name: "download-settings-storage",
            storage: zustandStorage,
        }
    )
);