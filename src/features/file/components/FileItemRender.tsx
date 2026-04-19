import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, AppIcon } from "@/shared/ui";

// functions 
import { formatFileSize } from "@/functions/fileSizeFormater";
import { getImageDimensionsSafe } from "@/functions/getImageDimensions";

// hooks 
import { useTheme } from "@/shared/theme/useTheme";

// types 
import { fileType } from "@/types/file";

// component 
import { FilePreview } from "@/shared/components/filePreview";

export const FileItemRenderMemo = React.memo(({ item, index, onPress }: { item: fileType, index: number, onPress: (index: number) => void; }) => {
    const theme = useTheme();
    const fileSize = formatFileSize(item?.size);

    const [dimension, setDimension] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        let isMounted = true;

        const isImage = item.type?.startsWith("image");

        if (!isImage) return;

        getImageDimensionsSafe(item.uri).then((res) => {
            if (isMounted && res) {
                setDimension(res);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [item.uri]);

    return (
        <Pressable
            onPress={() => onPress(index)}
            style={[styles.itemContainer, { borderColor: theme.border }]}
        >

            {/* left side preview  */}
            <FilePreview
                file={item}
                fileWidth={60}
                maxFileHeight={60}
            />

            {/* middle content  */}
            <View style={{ gap: 2, flex: 1 }}>
                <Text
                    style={styles.fileName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item.name}
                </Text>

                {fileSize && (
                    <Text style={{ color: theme.textDim }}>
                        {fileSize}
                        {dimension && ` • ${dimension.width} x ${dimension.height}`}
                    </Text>
                )}
            </View>

            {/* view button / icon  */}
            <View
                style={{ marginRight: 10 }}
            >
                <AppIcon
                    name="remove-red-eye"
                />
            </View>

        </Pressable>
    )
});

const styles = StyleSheet.create({
    itemContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 8,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    fileName: {
        flexShrink: 1,
    },
});