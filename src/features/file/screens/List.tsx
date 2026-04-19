import React, { useState, useMemo, useEffect } from "react"
import { FlatList } from "react-native"
import { Screen, Button, View } from "@/shared/ui"

// root 
import { APP_ROUTES } from "@/app/navigation/routes";

// types 
import { fileType } from "@/types/file";

// hook 
import { useFileStore } from "@/features/home/store/fileStore";
import { useNavigation } from "@react-navigation/native";
import { useBatchDownload } from "../hooks/useBatchDownload";
import { useDownloadReportStore } from "../store/useDownloadReportStore";

// components 
import { FileItemRenderMemo } from "../components/FileItemRender";
import { DownloadNote } from "../components/DonwloadNote";
import { DownloadProgressing } from "../components/DownloadProgress";
import { LoaderMore } from "@/shared/components/Loader";




export function FileListScreen() {
    console.log("Files List screen rendered");
    const files = useFileStore((s) => s?.files);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const navigation = useNavigation<any>();
    const { startBatch, cancelBatch } = useBatchDownload();
    const isRunning = useDownloadReportStore((s) => s.isRunning);

    const visibleItem = useMemo(() => {
        return (files ?? []).slice(0, visibleCount);
    }, [files, visibleCount]);


    const handleItemPress = (index: number) => {
        navigation.navigate(APP_ROUTES.FILE_FEATURE.FILE_DETAILS, {
            index: index
        });
    };




    const renderItem = React.useCallback(
        ({ item, index }: { item: fileType; index: number }) => (
            <FileItemRenderMemo
                item={item}
                index={index}
                onPress={handleItemPress}
            />
        ),
        [handleItemPress]
    );


    return (
        <Screen>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={visibleItem}
                renderItem={renderItem}
                keyExtractor={(item) => item.uri}

                contentContainerStyle={{ padding: 10 }}
                onEndReachedThreshold={0.5}

                ListFooterComponent={() =>
                    isLoadingMore ? <LoaderMore /> : null
                }

                onEndReached={() => {
                    if (!files || visibleCount >= files.length || isLoadingMore) return;

                    setIsLoadingMore(true);

                    setTimeout(() => {
                        setVisibleCount((prev) => prev + 20);
                        setIsLoadingMore(false);
                    }, 300); // 200–400ms feels natural
                }}
            />

            {/* static button  */}
            <View>
                <DownloadNote
                    note={"These download settings will be applied."}
                />
                {isRunning && (
                    <DownloadProgressing onCancel={cancelBatch} />
                )}
                <Button
                    title="Download"
                    style={{ borderRadius: 0 }}
                    loading={isRunning}
                    onPress={() => startBatch(files)}
                />
            </View>
        </Screen>
    )
}