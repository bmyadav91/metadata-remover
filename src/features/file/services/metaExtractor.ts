import { normalizeUri } from './utils/normalizeUri';
import { processFile } from './MetaExtractor/processFile';
import { cleanup } from './utils/cleanup';

export const runPipeline = async (originalUri: string, fileName?: string) => {
    let tempPath: string | null = null;

    try {
        const originalResult = await processFile(originalUri);
        let finalResult = originalResult;

        const shouldFallback =
            originalUri?.startsWith('content://') &&
            metadataScore(originalResult) < 4;

        if (shouldFallback) {
            try {
                const normalized = await normalizeUri(originalUri, fileName);
                tempPath = normalized?.tempPath;

                const fallbackResult = await processFile(normalized?.uri);

                const originalScore = metadataScore(originalResult);
                const fallbackScore = metadataScore(fallbackResult);

                // Replace ONLY if better
                if (fallbackScore > originalScore) {
                    finalResult = fallbackResult;
                }

            } catch (e) {
                console.error("eeror during fallback for runPipeline", e);
                throw e;
            }
        }

        return finalResult;

    } finally {
        if (tempPath) {
            await cleanup(tempPath);
        }
    }
};

const metadataScore = (data: any) => {
    if (!data) return 0;

    let score = 0;

    if (data?.Model || data?.Make) score += 2;        // camera info (important)
    if (data?.DateTime) score += 2;                  // capture time
    if (data?.GPSLatitude && data?.GPSLongitude) score += 3; // GPS (rare, high value)

    return score;
};