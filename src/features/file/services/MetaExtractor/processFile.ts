import { read } from '@lodev09/react-native-exify';

export const processFile = async (uri: string) => {
    const exif = await read(uri);

    return exif;
};