import { ProcessedFileResult } from "../../types/report.types";
import { fileType } from "@/types/file";
import type { CancelToken } from "@/types/cancel";
import { removeMetaManager } from "../metaDataRemover";
import { DownloadSettingsType } from "@/types/donwloadSettings";
import { TelemetryService } from "@/services/TelemetryService";


type BatchCallbacks = {
    onProgress?: (done: number, total: number) => void;
    onItemComplete?: (result: ProcessedFileResult) => void;
};

export const processFilesInBatch = async (
    files: fileType[],
    settings: DownloadSettingsType,
    callbacks?: BatchCallbacks,
    cancelToken?: CancelToken
) => {
    const results: ProcessedFileResult[] = [];
    let completed = 0;

    // limit concurrency 
    const CONCURRENCY = 3;
    const queue = [...files];

    const worker = async () => {
        while (true) {
            if (cancelToken?.cancelled) {
                console.log("Worker cancelled");
                break;
            }

            const file = queue.shift();
            if (!file) break;

            try {
                const res = await removeMetaManager(
                    file.uri,
                    file.type,
                    file.name,
                    settings
                );

                if (cancelToken?.cancelled) break;

                callbacks?.onItemComplete?.({
                    originalUri: file.uri,
                    newUri: res?.uri,
                    newName: res?.filename || undefined,
                    newSize: res?.fileSize || undefined,
                    status: "success",
                });

            } catch (err: any) {
                if (cancelToken?.cancelled) break;

                callbacks?.onItemComplete?.({
                    originalUri: file.uri,
                    status: "error",
                    error: err?.message,
                });

                TelemetryService.recordHandledError(err, "ProcessFile Batch Failed");


            } finally {
                completed++;
                callbacks?.onProgress?.(completed, files.length);
            }
        }
    };

    // run workers in parallel
    const effectiveConcurrency = Math.min(CONCURRENCY, files?.length);
    await Promise.all(
        Array.from({ length: effectiveConcurrency }, worker)
    );

    return results;
};