import { create } from "zustand";

import type { ProcessedFileResult } from "../types/report.types";


type DownloadReportState = {
    total: number;
    completed: number;
    successCount: number;
    errorCount: number;
    results: Record<string, ProcessedFileResult>;
    isRunning: boolean;

    start: (total: number) => void;
    updateProgress: (done: number) => void;
    addResult: (result: ProcessedFileResult) => void;
    finish: () => void;
    reset: () => void; // 👈 add this
};

const initialState = {
    total: 0,
    completed: 0,
    successCount: 0,
    errorCount: 0,
    results: {},
    isRunning: false,
};

export const useDownloadReportStore = create<DownloadReportState>((set) => ({
    ...initialState,

    start: (total) =>
        set((state) => ({
            ...state,
            total,
            isRunning: true,
        })),

    updateProgress: (completed) =>
        set({ completed }),

    addResult: (result) =>
        set((state) => {
            const key = result.originalUri;
            const existing = state.results[key];

            let successCount = state.successCount;
            let errorCount = state.errorCount;

            if (!existing || existing.status !== result.status) {
                if (result.status === "success") successCount++;
                else if (result.status === "error") errorCount++;
            }

            return {
                results: {
                    ...state.results,
                    [key]: result,
                },
                successCount,
                errorCount,
            };
        }),

    finish: () =>
        set({ isRunning: false }),

    reset: () =>
        set(initialState),
}));