import { View, Text } from "@/shared/ui";
import { useTheme } from "@/shared/theme/useTheme";
import { useDownloadReportStore } from "../store/useDownloadReportStore";

export const DownloadProgressing = ({
    onCancel,
}: {
    onCancel: () => void;
}) => {
    const theme = useTheme();
    const isRunning = useDownloadReportStore((s) => s.isRunning);
    const completed = useDownloadReportStore((s) => s.completed);
    const total = useDownloadReportStore((s) => s.total);

    const percent =
        total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    if (!isRunning) return null;

    return (
        <View
            style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Text>
                Processing {completed}/{total} ({percent}%)
            </Text>

            <Text
                style={{ color: theme.danger, fontWeight: "600", padding: 6 }}
                onPress={onCancel}
            >
                Cancel
            </Text>
        </View>
    );
};