// app 
import { AppError } from "@/app/AppError";

// constants 
import { ERROR_CODES } from "@/constants/ErrorCodes";

// functions 
import { getFileCategory } from "@/functions/getFileCategory";

// internal pipe 
import { processImage } from "./MetaRemover/imageResize";
import { saveToGallery } from "./MetaRemover/save";

// type 
import type { DownloadSettingsType } from '@/types/donwloadSettings';


export const removeMetaManager = async (uri: string, fileType: string, fileName: string, options: DownloadSettingsType) => {

    const FileCategory = getFileCategory(fileType, fileName);

    switch (FileCategory) {
        case "image":
            return await removeImageMeta(
                uri,
                fileName,
                fileType,
                options,
            )

        default:
            throw new AppError(
                ERROR_CODES.UNSUPPORTED_FILE,
                "Unsupported file type",
                true // expected → do NOT log to crashlytics
            );
    }

}


export const removeImageMeta = async (uri: string, fileName: string, fileType: string, options: DownloadSettingsType) => {

    // resize or remake the image 
    const proccessResultUri = await processImage(
        uri,
        fileType,
        options
    );

    // save to the gallery 
    const saveGalleryRes = await saveToGallery(
        proccessResultUri?.uri,
        "photo",
        proccessResultUri?.isTempUrl,
        fileName,
    )

    return saveGalleryRes;
}