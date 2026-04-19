import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { PermissionManager } from '@/services/Permissions';
import { cleanup } from '../utils/cleanup';

import { getExtensionFromPath } from '@/functions/extensionExtractor';


// generalize jpeg and jpg only for matching purpose 
const canonicalExt = (ext: string | null): string | null => {
    if (!ext) return null;
    if (ext === 'jpeg') return 'jpg';
    return ext;
};


export const saveToGallery = async (
    uri: string,
    type: "photo" | "video",
    isTempUrl: boolean,
    originalName?: string,
) => {
    try {
        // const hasPermission = await PermissionManager.requestGalleryPermission(type);

        let finalUriToSave = uri;

        // try to keep original name 
        if (isTempUrl && originalName) {
            try {
                const safeName = originalName.trim();

                const uriExt = canonicalExt(getExtensionFromPath(uri));
                const nameExt = canonicalExt(getExtensionFromPath(safeName));

                if (uriExt && nameExt && uriExt === nameExt) {
                    const directory = uri.substring(0, uri.lastIndexOf('/'));
                    const newPath = `${directory}/${safeName}`;

                    if (newPath !== uri) {
                        await RNFS.moveFile(uri, newPath);
                        finalUriToSave = newPath;
                    }
                }

            } catch (e) {
                console.error("rename failed:", e);
            }
        }

        let response;

        try {
            response = await CameraRoll.saveAsset(finalUriToSave, { type });
        } catch (err) {
            // ❗ Only treat as permission issue if permission denied
            // if (!hasPermission) {
            //     throw new Error("Permission denied and device requires it");
            // }

            throw err; // real failure
        }

        if (isTempUrl) {
            await cleanup(finalUriToSave);
        }

        return response?.node?.image;

    } catch (e) {
        console.error('Save failed:', e);
        throw e;
    }
};