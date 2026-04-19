import { Image } from "react-native";

export const getImageDimensionsSafe = (uri: string) => {
    return new Promise<{ width: number; height: number } | null>((resolve) => {
        if (!uri) return resolve(null);

        try {
            Image.getSize(
                uri,
                (width, height) => resolve({ width, height }),
                () => resolve(null)
            );
        } catch {
            resolve(null);
        }
    });
};