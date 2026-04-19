import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native"
import { View, Text, AppIcon } from "@/shared/ui";

// hooks 
import { useTheme } from "@/shared/theme/useTheme";

// functions 
import { formatFileSize } from "@/functions/fileSizeFormater";
import { getImageDimensionsSafe } from "@/functions/getImageDimensions";

// types 
import type { ProcessedFileResult } from "../types/report.types";
import type { fileType } from "@/types/file";


// components 
import { FilePreview } from "@/shared/components/filePreview";



export const ReportItem = React.memo(({ item }: { item: ProcessedFileResult & fileType }) => {
    const theme = useTheme();

    const orginalFileSize = formatFileSize(item?.size);
    const newFileSize = formatFileSize(item?.newSize);

    const [oldDimension, setOldDimension] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const [newDimension, setNewDimension] = useState<{
        width: number;
        height: number;
    } | null>(null);

    // calculate old file dimension if it is image 
    useEffect(() => {
        let isMounted = true;

        const isImage = item.type?.startsWith("image");

        if (!isImage) return;

        // original dimension
        if (item.uri) {
            getImageDimensionsSafe(item.uri).then((res) => {
                if (isMounted && res) {
                    setOldDimension(res);
                }
            });
        }

        // new dimension
        if (item.newUri) {
            getImageDimensionsSafe(item.newUri).then((res) => {
                if (isMounted && res) {
                    setNewDimension(res);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [item.uri, item.newUri]);

    return (
        <View style={[styles.itemWraper, { borderColor: theme.border }]}>
            {/* left side preview  */}
            <FilePreview
                file={item}
                fileWidth={60}
                maxFileHeight={60}
            />

            <View style={styles.textGroup}>
                <Text
                    style={styles.fileName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item?.name || item?.newName}
                </Text>

                <View style={styles.comparisonGroup}>
                    {orginalFileSize && (
                        <Text style={{ color: theme.textDim }}>{orginalFileSize}
                            {oldDimension && `\n${oldDimension.width} x ${oldDimension.height}`}
                        </Text>
                    )}

                    {newFileSize && (
                        <>
                            <AppIcon
                                name="arrow-right-alt"
                            />
                            <Text style={{ color: theme.textDim }}>{newFileSize}
                                {newDimension && `\n${newDimension.width} x ${newDimension.height}`}
                            </Text>
                        </>
                    )}
                </View>
                
                {item?.error && (
                    <Text style={{ color: theme.danger, padding: 5 }} numberOfLines={2}>
                        {item?.error}
                    </Text>
                )}

            </View>

        </View>
    );
});


const styles = StyleSheet.create({
    itemWraper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: .5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,

        marginBottom: 10,
    },

    textGroup: {
        flex: 1,
        flexDirection: "column",
    },

    fileName: {
        flexShrink: 1,
        flex: 1,
    },

    comparisonGroup: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    }
});