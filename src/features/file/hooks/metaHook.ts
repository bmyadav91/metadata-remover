import { useEffect, useRef, useState } from "react";
import type { fileType } from "@/types/file"

// service 
import { runPipeline } from "../services/metaExtractor";
import { TelemetryService } from "@/services/TelemetryService";



export const useExtractMetaData = (file?: fileType) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Record<string, any> | null>(null);

    const isActiveRef = useRef(true);

    useEffect(() => {
        isActiveRef.current = true;

        if (!file?.uri) {
            setData(null);
            return;
        }

        const extractMeta = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await runPipeline(file.uri);
                // console.log("metadata res: ", response);

                if (!isActiveRef.current) return;

                setData(response);
            } catch (err: any) {
                if (!isActiveRef.current) return;
                TelemetryService.recordHandledError(err);

                setError(err?.message || "Failed to extract metadata");
            } finally {
                if (isActiveRef.current) setLoading(false);
            }
        };

        extractMeta();

        return () => {
            isActiveRef.current = false;
        };
    }, [file?.uri]);

    return { data, loading, error };
};