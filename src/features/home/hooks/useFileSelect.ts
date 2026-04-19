import { useState } from "react";
import { pick } from "@react-native-documents/picker";

import { TelemetryService, ANALYTICS_EVENTS } from "@/services/TelemetryService";

export const useFileSelection = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleFileSelect = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await pick({
                allowMultiSelection: true,
                type: ["*/*"]
            });

            // console.log("result of file selection: ", result);

            TelemetryService.logTelemetryEvent(ANALYTICS_EVENTS.FILE_SELECTED, {
                count: result?.length || 0,
                types: [...new Set(result?.map(f => f?.type))]
                    ?.slice(0, 3)
                    ?.join(','),
            });

            return result;
        } catch (err: any) {
            const code = err?.code ?? err?.name ?? "";
            const message = String(err?.message ?? "").toLowerCase();

            const isUserCancel =
                code === "DOCUMENT_PICKER_CANCELED" ||
                code === "E_PICKER_CANCELLED" ||
                code === "CANCELLED" ||
                code === "USER_CANCELLED" ||
                message.includes("cancel");

            if (isUserCancel) {
                TelemetryService.logTelemetryEvent(ANALYTICS_EVENTS.FILE_SELECTION_CANCELLED);
                return;
            }

            TelemetryService.recordHandledError(err, "useFileSelection -> handleFileSelect");

            setError(err?.message || "");
        } finally {
            setLoading(false)
        }
    };

    return { handleFileSelect, loading, error }
}