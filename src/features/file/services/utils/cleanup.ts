import RNFS from 'react-native-fs';

export const cleanup = async (tempPath?: string | null) => {
    if (!tempPath) return;

    try {
        await RNFS.unlink(tempPath);
    } catch (e) {
        console.error("Error while deleting tmp file by RNFS: ", e);
    }
};