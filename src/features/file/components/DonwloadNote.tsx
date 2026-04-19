import { Text, View } from "@/shared/ui";
import { useTheme } from "@/shared/theme/useTheme";

import { APP_ROUTES } from "@/app/navigation/routes";
// hooks 
import { useNavigation } from "@react-navigation/native";

export const DownloadNote = ({ note }: { note: string }) => {
    const theme = useTheme();
    const navigation = useNavigation<any>();

    return (
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center", padding: 5, justifyContent: "center", borderTopWidth: .2, borderColor: theme.textDim }}>

            <Text style={{ flex: 1, textAlign: "center", flexWrap: "wrap", letterSpacing: .5 }}>
                {note} {" "}

                <Text
                    style={{
                        color: theme?.primary,
                        textAlign: "right",
                        flex: 1,
                        flexWrap: "wrap"
                    }}
                    onPress={() => navigation.navigate(APP_ROUTES.FILE_FEATURE.DOWNLOAD_SETTINGS)}
                >
                    download settings.
                </Text>

                {/* <Text
                    style={{
                        color: theme?.primary,
                        textAlign: "right",
                        flex: 1,
                        flexWrap: "wrap"
                    }}
                    onPress={() => fileNavigation.navigate(APP_ROUTES.FILE.DOWNLOAD_REPORT)}
                >
                    Download report.
                </Text> */}

            </Text>

        </View>
    );
};