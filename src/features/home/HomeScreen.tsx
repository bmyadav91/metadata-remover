import { View, StyleSheet, Pressable } from "react-native";
import { ScrollScreen, Screen, AppIcon, Text, Button } from "@/shared/ui";

// root 
import { APP_ROUTES } from "@/app/navigation/routes";

// hook 
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/shared/theme/useTheme";
import { useFileSelection } from "./hooks/useFileSelect";
import { useFileStore } from "./store/fileStore";
import { useDownloadReportStore } from "../file/store/useDownloadReportStore";



export function HomeScreen() {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const { handleFileSelect, loading, error } = useFileSelection();
    const setFiles = useFileStore((s) => s?.setFiles);
    const resetReport = useDownloadReportStore((s) => s.reset);

    const onHandlePick = async () => {
        const result = await handleFileSelect();
        if (!result || result?.length === 0) return;

        const normalizedFiles = result?.map((file) => ({
            uri: file.uri,
            name: file.name ?? "unknown",
            type: file.type ?? "unknown",
            size: file.size ?? undefined,
        }));

        resetReport();
        setFiles(normalizedFiles);

        if (normalizedFiles?.length === 1) {
            navigation.navigate(APP_ROUTES.FILE_FEATURE.FILE_DETAILS, {
                index: 0
            });
        } else {
            navigation.navigate(APP_ROUTES.FILE_FEATURE.FILE_LIST);
        }
    };

    return (
        <Screen>
            <ScrollScreen
                contentContainerStyle={[
                    styles.container,
                    { flexGrow: 1 }
                ]}
            >

                {/* Main Upload Section */}
                <Pressable
                    style={[styles.uploadArea, { borderColor: theme.card }]}
                    onPress={onHandlePick}
                >
                    <AppIcon name="Upload" size={90} color={theme.text} />

                    <View style={styles.textGroup}>
                        <Text style={[styles.text, styles.headingText]}>Select files</Text>

                        <Text style={[styles.text, { color: theme.textDim }]}>
                            Upload one or more files to view or remove metadata.
                        </Text>
                    </View>

                    <Button
                        title="Choose File"
                        icon={<AppIcon name="Upload" size={22} />}
                        onPress={onHandlePick}
                        loading={loading}
                    />

                    {error && (
                        <Text style={[styles.text, { color: "red" }]}>{error}</Text>
                    )}
                </Pressable>

                {/* Privacy & Info Section */}
                <View style={styles.footer}>
                    <Text style={[styles.text, { color: theme.textDim, letterSpacing: .5 }]}>
                        Your files are processed entirely on this device.
                        They are never uploaded to any server.
                    </Text>

                    <Text style={styles.text}>
                        By using this tool, you agree to our{" "}
                        <Text
                            style={{ color: theme.primary }}
                            onPress={() =>
                                navigation.navigate(APP_ROUTES.PRIVACY_FEATURE.PRIVACY_POLICY_TERMS)
                            }
                        >
                            Privacy Policy & Terms.
                        </Text>
                    </Text>
                </View>

            </ScrollScreen>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    uploadArea: {
        width: '100%',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        gap: 15,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    textGroup: {
        alignItems: 'center',
        gap: 4,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },
});