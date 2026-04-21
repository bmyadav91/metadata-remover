import { useMemo, useState, useEffect } from "react";
import { StyleSheet, Linking } from "react-native";
import { ScrollScreen, Text, Screen, Button, View } from "@/shared/ui";

// constants 
import { CONSTANT_LINKS } from "@/constants/links";

// functions 
import { formatFileSize } from "@/functions/fileSizeFormater";
import { getFileCategory } from "@/functions/getFileCategory";
import { getImageDimensionsSafe } from "@/functions/getImageDimensions";

// hooks 
import { useRoute } from "@react-navigation/native";
import { useFileStore } from "@/features/home/store/fileStore";
import { useTheme } from "@/shared/theme/useTheme";
import { useExtractMetaData } from "../hooks/metaHook";
import { useBatchDownload } from "../hooks/useBatchDownload";
import { useDownloadReportStore } from "../store/useDownloadReportStore";

// component
import { Skeleton } from "@/shared/components/Skeleton";
import { FilePreview } from "@/shared/components/filePreview";
import { DownloadNote } from "../components/DonwloadNote";
import { DownloadProgressing } from "../components/DownloadProgress";



export function FileDetailScreen() {
    const route = useRoute();
    const { index } = route?.params as { index: number } ?? 0;
    const files = useFileStore((s) => s?.files);
    const theme = useTheme();
    const isRunning = useDownloadReportStore((s) => s.isRunning);

    const selectedFile = useMemo(() => {
        if (!Number.isInteger(index)) return null;

        if (index < 0 || index >= files.length) return null;

        return files[index];
    }, [files, index]);

    const fileSize = useMemo(() => formatFileSize(selectedFile?.size), [selectedFile]);
    const fileCategory = useMemo(() => getFileCategory(selectedFile?.type || "", selectedFile?.name || ""), [selectedFile]);
    const isSupportedCategory = ["image", "video"].includes(fileCategory ?? "");

    const { data, error, loading } = useExtractMetaData(selectedFile || undefined);
    const entries = useMemo(() => data ? Object.entries(data) : [], [data]);

    const { latitude, longitude } = useMemo(() => {
        if (!data) return { latitude: null, longitude: null };

        let lat = typeof data?.GPSLatitude === "number" ? data?.GPSLatitude : null;
        let lon = typeof data?.GPSLongitude === "number" ? data?.GPSLongitude : null;

        if (lat !== null && data?.GPSLatitudeRef === "S") lat *= -1;
        if (lon !== null && data?.GPSLongitudeRef === "W") lon *= -1;

        return { latitude: lat, longitude: lon };
    }, [data]);

    const { startBatch, cancelBatch } = useBatchDownload();

    // check if already stripped or compressed 
    const hasMetadata = entries?.length > 5;

    const [dimension, setDimension] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        let isMounted = true;

        const isImage = fileCategory === "image";

        if (!isImage || !selectedFile?.uri) return;

        getImageDimensionsSafe(selectedFile?.uri).then((res) => {
            if (isMounted && res) {
                setDimension(res);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [selectedFile?.uri]);

    // showing skelton if loading state 
    if (loading) {
        return <Skeleton
            count={3}
            height={300}
        />
    }

    // rarely thsi - if file not selected 
    if (!selectedFile) {
        return (
            <Screen
                style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10 }}
            >
                <Text>No file was selected.</Text>

            </Screen>
        )
    }








    return (
        <Screen>
            <ScrollScreen
                contentContainerStyle={[
                    styles.container,
                ]}
            >
                {/* Status / Info Message */}

                {error ? (
                    <Text style={styles.warningText}>
                        {error}
                    </Text>
                ) : !isSupportedCategory ? (
                    <Text style={styles.warningText}>
                        This file type is not supported yet.
                    </Text>
                ) : !hasMetadata ? (
                    <View>
                        <Text style={[styles.warningText, { fontWeight: "600", fontSize: 17 }]}>
                            No metadata found
                        </Text>

                        <Text style={styles.warningText}>
                            It may have been edited, compressed, or shared via apps like WhatsApp or Instagram, which remove metadata.
                        </Text>

                        <Text style={styles.warningText}>
                            💡 Use the original file or send it as a document to keep metadata.
                        </Text>
                    </View>
                ) : null}


                {/* file preiew  */}
                <FilePreview
                    file={selectedFile}
                    fileWidth={250}
                    maxFileHeight={400}
                    fullWidth={true}
                />

                {/* file size  */}
                <View style={[styles.row, { backgroundColor: theme.border, marginTop: 8 }]}>
                    <Text
                        style={styles.generalText}
                        numberOfLines={5}
                        ellipsizeMode="tail"
                    >
                        {selectedFile?.name}</Text>
                    {fileSize && (
                        <Text style={{ color: theme.textDim }}>{fileSize}
                            {dimension && `\n${dimension.width} x ${dimension.height}`}
                        </Text>
                    )}
                </View>


                {/* file meta data  */}
                {entries?.length > 3 ? (
                    <View>

                        {/* if lat long exist then show location link  */}
                        {latitude !== null && longitude !== null && (
                            <View
                                style={[
                                    styles.row,
                                    { backgroundColor: theme.border, marginTop: 8 }
                                ]}
                            >
                                <Text style={styles.keyText} numberOfLines={3}>
                                    Location
                                </Text>

                                <Text
                                    style={[styles.valueText, { color: theme.primary }]}
                                    onPress={() =>
                                        Linking.openURL(
                                            CONSTANT_LINKS.GOOGLE_MAP_BASE + `${latitude},${longitude}`
                                        )
                                    }
                                >
                                    View maps
                                </Text>
                            </View>
                        )}

                        {/* <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                Model/Make
                            </Text>

                            <Text style={styles.valueText}>OnePlus 7 5G</Text>
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                Latitude
                            </Text>

                            <Text style={styles.valueText}>26.7514197</Text>
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                Longitude
                            </Text>

                            <Text style={styles.valueText}>83.3548535</Text>
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                Camera Lens
                            </Text>

                            <Text style={styles.valueText}>Sony IMX586 sensor</Text>
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                Date & Time
                            </Text>

                            <Text style={styles.valueText}>2026:04:18 22:33:29</Text>
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: theme.border, marginTop: 8 }
                            ]}
                        >
                            <Text style={styles.keyText} numberOfLines={3}>
                                A
                            </Text>

                            <Text style={styles.valueText}>2026:04:18 22:33:29</Text>
                        </View> */}

                        {entries.map(([key, value]) => (
                            <View
                                style={[
                                    styles.row,
                                    { backgroundColor: theme.border, marginTop: 8 }
                                ]}
                                key={key}
                            >
                                <Text style={styles.keyText} numberOfLines={3}>
                                    {key}
                                </Text>

                                <Text style={styles.valueText}>
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 10 }}>
                        No metadata found (file may be compressed or stripped)
                    </Text>
                )}

            </ScrollScreen>

            {/* static button - for only supported file */}
            {isSupportedCategory && (
                <View>
                    <DownloadNote
                        note={"These download settings will be applied."}
                    />
                    {isRunning && (
                        <DownloadProgressing onCancel={cancelBatch} />
                    )}
                    <Button
                        title={"Download"}
                        style={{ borderRadius: 0 }}
                        loading={isRunning}
                        onPress={() => startBatch(selectedFile)}
                    />
                </View>
            )}
        </Screen>
    )
}



const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },

    row: {
        width: "100%",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 7,
    },

    generalText: {
        flex: 1
    },

    keyText: {
        flex: 1,
        maxWidth: "50%",
        fontWeight: "600",
        flexWrap: "wrap",
    },

    valueText: {
        flex: 1,
        maxWidth: "50%",
        textAlign: "right",
        flexWrap: "wrap",
    },

    warningText: {
        marginVertical: 5,
        textAlign: "center",
        letterSpacing: .5,
    }

});