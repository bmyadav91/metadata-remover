import { useRef } from "react";
import { APP_ROUTES } from "@/app/navigation/routes";
import { Alert, Linking } from "react-native";
// types 
import type { fileType } from "@/types/file";
import type { CancelToken } from "@/types/cancel";

// hook 
import { useNavigation } from "@react-navigation/native";
import { useDownloadSettingsStore } from "../store/useDownloadSettings";
import { useDownloadReportStore } from "../store/useDownloadReportStore";

// services 
import { PermissionManager } from "@/services/Permissions";
import { processFilesInBatch } from "../services/batch/processFilesInBatch";
import { TelemetryService } from "@/services/TelemetryService";


export const useBatchDownload = () => {
    const { width, height, quality, removeMetadata } = useDownloadSettingsStore();

    const start = useDownloadReportStore((s) => s.start);
    const updateProgress = useDownloadReportStore((s) => s.updateProgress);
    const addResult = useDownloadReportStore((s) => s.addResult);
    const finish = useDownloadReportStore((s) => s.finish);
    const isRunning = useDownloadReportStore((s) => s.isRunning);

    const cancelRef = useRef<CancelToken>({ cancelled: false });
    const navigation = useNavigation<any>();

    const startBatch = async (files: fileType | fileType[]) => {
        cancelRef.current.cancelled = false;

        if (!files) return;
        if (isRunning) return;

        const fileList = Array.isArray(files) ? files : [files];
        if (!fileList.length) return;

        const hasPermission = await PermissionManager.requestGalleryPermission("photo");

        if (!hasPermission) {
            Alert.alert(
                "Permission Required",
                "We need access to save files. Please enable it from Settings.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        const existingResults = useDownloadReportStore.getState().results;

        const filteredFiles = fileList.filter(
            (file) => existingResults[file.uri]?.status !== "success"
        );

        if (filteredFiles.length === 0) {
            Alert.alert(
                "Already Downloaded",
                "All selected files are already saved.",
                [
                    {
                        text: "Check report",
                        onPress: () =>
                            navigation.navigate(APP_ROUTES.FILE_FEATURE.DOWNLOAD_REPORT),
                    },
                ]
            );
            return;
        }

        let didRun = true;

        start(filteredFiles.length);

        try {
            await processFilesInBatch(
                filteredFiles,
                { width, height, quality, removeMetadata },
                {
                    onProgress: updateProgress,
                    onItemComplete: addResult,
                },
                cancelRef.current
            );
        } catch (err: any) {
            console.error("Batch failed:", err);
            TelemetryService.recordHandledError(err, "useBatchDownload -> btach failed download")
        } finally {
            cancelRef.current.cancelled = false;
            finish();

            if (didRun) {
                setTimeout(() => {
                    navigation.navigate(APP_ROUTES.FILE_FEATURE.DOWNLOAD_REPORT);
                }, 0);
            }
        }
    };

    const cancelBatch = () => {
        cancelRef.current.cancelled = true;
        finish();
    };

    return { startBatch, cancelBatch };
};