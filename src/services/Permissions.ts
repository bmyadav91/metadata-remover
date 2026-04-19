import { Platform, PermissionsAndroid } from "react-native";
import { TelemetryService, ANALYTICS_EVENTS } from "./TelemetryService";

export class PermissionManager {
    private static galleryPhotoGranted: boolean | null = null;
    private static galleryVideoGranted: boolean | null = null;

    static async requestGalleryPermission(type: "photo" | "video"): Promise<boolean> {
        if (Platform.OS !== "android") return true;

        if (type === "photo" && this.galleryPhotoGranted === true) {
            return true;
        }

        if (type === "video" && this.galleryVideoGranted === true) {
            return true;
        }

        const version = Number(Platform.Version);

        try {
            let permission;

            if (version >= 33) {
                permission =
                    type === "photo"
                        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                        : PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO;
            } else if (version >= 29) {
                permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            } else {
                permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            }

            const granted = await PermissionsAndroid.request(permission);
            const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;

            // Cache ONLY true
            if (isGranted) {
                if (type === "photo") {
                    this.galleryPhotoGranted = true;
                } else {
                    this.galleryVideoGranted = true;
                }
            }

            // Track permission outcomes
            TelemetryService.logTelemetryEvent(ANALYTICS_EVENTS.PERMISSION_REQUESTED, {
                type: type,
                granted: isGranted ? 'true' : 'false',
                os_version: version
            });

            return isGranted;

        } catch (err: any) {
            console.warn("Permission error:", err);
            TelemetryService.recordHandledError(err, "requestGalleryPermission error");
            return false;
        }
    }
}