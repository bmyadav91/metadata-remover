import { View, StyleSheet } from "react-native";
import { Text } from "@/shared/ui";
import { ScreenHeading } from "@/shared/components/screenHeading";
import { useTheme } from "@/shared/theme/useTheme";

export const ReportHeader = ({
    successCount,
    errorCount,
}: {
    successCount: number;
    errorCount: number;
}) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <ScreenHeading>Download Report</ScreenHeading>

            <View style={[styles.card, { backgroundColor: theme.card }]}>

                {/* Success */}
                <View style={styles.block}>
                    <Text style={[styles.count, { color: theme.success }]}>
                        {successCount}
                    </Text>
                    <Text style={styles.label}>Success</Text>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: theme.gray }]} />

                {/* Error */}
                <View style={styles.block}>
                    <Text style={[styles.count, { color: theme.danger }]}>
                        {errorCount}
                    </Text>
                    <Text style={styles.label}>Failed</Text>
                </View>

            </View>

            {successCount > 0 && (
                <Text style={{ color: theme?.textDim, textAlign: "center", paddingVertical: 5 }}>
                    {successCount} file{successCount > 1 ? "s have" : " has"} been saved.
                    Check your Gallery or File Manager.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 10,
        marginBottom: 10,
    },

    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,

        elevation: 2, // Android shadow
    },

    block: {
        flex: 1,
        alignItems: "center",
    },

    count: {
        fontSize: 22,
        fontWeight: "700",
    },

    label: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 4,
    },

    divider: {
        width: 1,
        height: "60%",
        opacity: 0.3,
    },
});