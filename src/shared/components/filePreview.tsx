import { Pressable, Image, Linking, Alert } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import { AppIcon, View } from "../ui";
import { getFileCategory } from "@/functions/getFileCategory";
import type { fileType } from "@/types/file";

const handleOpen = async (uri: string) => {
    try {
        if (uri.startsWith('http')) {
            await Linking.openURL(uri);
        } else {
            await FileViewer.open(uri); // fallback for local files
        }
    } catch (e) {
        Alert.alert('Error', 'Unable to open file');
        console.log(e);
    }
};

export const FilePreview = ({
    file,
    fileWidth = 50,
    maxFileHeight,
    fullWidth = false,
}: {
    file: fileType;
    fileWidth?: number;
    maxFileHeight?: number;
    fullWidth?: boolean;
}) => {
    const category = getFileCategory(file?.type, file?.name) ?? "";

    let content: React.ReactNode;

    switch (category) {
        case "image":
            content = fullWidth ? (
                <Image
                    source={{ uri: file.uri }}
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                        maxHeight: maxFileHeight,
                        borderRadius: 4,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{
                        width: fileWidth,
                        height: maxFileHeight,
                    }}
                >
                    <Image
                        source={{ uri: file.uri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </View>
            );
            break;

        case "video":
            content = <AppIcon name="video-file" size={fileWidth} />;
            break;

        case "pdf":
            content = <AppIcon name="picture-as-pdf" size={fileWidth} />;
            break;

        case "audio":
            content = <AppIcon name="audio-file" size={fileWidth} />;
            break;

        case "text":
            content = <AppIcon name="text-snippet" size={fileWidth} />;
            break;

        case "archive":
            content = <AppIcon name="archive" size={fileWidth} />;
            break;

        default:
            content = <AppIcon name="attach-file" size={fileWidth} />;
    }

    return (
        <Pressable onPress={() => handleOpen(file.uri)}>
            {content}
        </Pressable>
    );
};