import ImageResizer from '@bam.tech/react-native-image-resizer';

// functions 
import { extractNumber } from '@/functions/numberExtractor';
import { getFileExtension } from '@/functions/extensionExtractor';

// type 
import type { DownloadSettingsType } from '@/types/donwloadSettings';



export const processImage = async (uri: string, fileType: string, options: DownloadSettingsType) => {
    try {
        const width = extractNumber(options?.width);
        const height = extractNumber(options?.height);
        const rawQuality = extractNumber(options?.quality);
        const quality = rawQuality == null ? 100 : Math.max(1, Math.min(100, rawQuality));

        const removeMetadata = Boolean(options?.removeMetadata);


        const shouldProcess =
            Boolean(width) ||
            Boolean(height) ||
            quality !== 100 ||
            removeMetadata;

        if (!shouldProcess) return { uri: uri, isTempUrl: false };

        const ext = getFileExtension(fileType) || "JPEG";

        const result = await ImageResizer.createResizedImage(
            uri,
            width || 9999,
            height || 9999,
            ext,
            quality || 100,
            0,
            null,
            !removeMetadata,
            {
                mode: "contain",
                onlyScaleDown: true // This prevents stretching/upscaling
            }
        );
        // console.log("resize image res: ", result);

        return { uri: result.uri, isTempUrl: true };

    } catch (err) {
        console.error('processImage error:', err);
        throw err;
    }
};