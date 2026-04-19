import { useMemo, useState } from "react";
import { Screen, View, Text, Button } from "@/shared/ui";
import { FlatList } from "react-native";
import { APP_ROUTES } from "@/app/navigation/routes";

// hooks
import { useNavigation } from "@react-navigation/native";
import { useFileStore } from "@/features/home/store/fileStore";
import { useDownloadReportStore } from "../store/useDownloadReportStore";

// components 
import { ReportItem } from "../components/reportItem";
import { ReportHeader } from "../components/DownloadReportHeader";



export function DownloadReportScreen() {
    const navigation = useNavigation<any>();
    const orginalFiles = useFileStore((s) => s.files);
    const resultFiles = useDownloadReportStore((s) => s.results ?? {});
    const successCount = useDownloadReportStore((s) => s.successCount);
    const errorCount = useDownloadReportStore((s) => s.errorCount);
    const reset = useDownloadReportStore((s) => s.reset);

    const [visibleCount, setVisibleCount] = useState(10);

    // filter first
    const processedFiles = useMemo(() => {
        return orginalFiles.filter((file) => resultFiles[file.uri]);
    }, [orginalFiles, resultFiles]);

    // paginate on filtered list
    const visibleFiles = useMemo(() => {
        return processedFiles.slice(0, visibleCount);
    }, [processedFiles, visibleCount]);

    // map only visible items
    const listData = useMemo(() => {
        return visibleFiles.map((file) => {
            const result = resultFiles[file.uri];

            return {
                ...file,
                originalUri: file.uri,
                status: result.status,
                newUri: result.newUri,
                newSize: result.newSize,
                error: result.error,
            };
        });
    }, [visibleFiles, resultFiles]);


    return (
        <Screen>
            <FlatList
                data={listData}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                    <ReportItem item={item} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

                ListHeaderComponent={() => (
                    <ReportHeader
                        successCount={successCount}
                        errorCount={errorCount}
                    />
                )}

                ListEmptyComponent={() => (
                    <Text style={{ textAlign: "center", paddingVertical: 20 }}>
                        No item found.
                    </Text>
                )}

                onEndReached={() => {
                    if (visibleCount < processedFiles.length) {
                        setVisibleCount((prev) => prev + 20);
                    }
                }}
                onEndReachedThreshold={0.5}
            />

            <View>
                <Button
                    title="Back to Home"
                    onPress={() => {
                        reset();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: APP_ROUTES.HOME_FEATURE.HOME_MAIN }],
                        });
                    }}
                />
            </View>
        </Screen>
    );
}