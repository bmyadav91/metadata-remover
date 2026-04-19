import RNFS from 'react-native-fs';

const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const getExtension = (name?: string) => {
    if (!name) return '';
    const match = name.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[0] : '';
};

export const normalizeUri = async (uri: string, fileName?: string) => {
    if (!uri.startsWith('content://')) {
        return { uri, tempPath: null };
    }

    const safeName = sanitizeFileName(fileName || 'temp');
    const ext = getExtension(fileName);

    const uniqueSuffix = Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    const tempPath = `${RNFS.CachesDirectoryPath}/meta_${safeName}_${uniqueSuffix}${ext}`;

    await RNFS.copyFile(uri, tempPath);

    return {
        uri: `file://${tempPath}`,
        tempPath,
    };
};