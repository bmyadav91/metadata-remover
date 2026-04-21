import { StyleSheet, TouchableOpacity } from "react-native";
import { ScrollScreen, Screen, View, Text, TextInput, AppSwitch, Button } from "@/shared/ui";

import { APP_ROUTES } from "@/app/navigation/routes";

// function 
import { extractNumber } from "@/functions/numberExtractor";

// hooks 
import { useDownloadSettingsStore } from "../store/useDownloadSettings";
import { useTheme } from "@/shared/theme/useTheme";
import { useNavigation } from "@react-navigation/native";

// components 
import { ScreenHeading } from "@/shared/components/screenHeading";

import { TelemetryService, ANALYTICS_EVENTS } from "@/services/TelemetryService";


export function DownloadSettingsScreen() {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const {
        width,
        height,
        quality,
        removeMetadata,
        setWidth,
        setHeight,
        setQuality,
        setRemoveMetadata,
        reset,
    } = useDownloadSettingsStore();



    const handleSave = () => {
        try {
            const parsedWidth = extractNumber(width);
            const parsedHeight = extractNumber(height);
            const parsedQuality = extractNumber(quality);

            const isValidWidth = parsedWidth !== null && parsedWidth > 0;
            const isValidHeight = parsedHeight !== null && parsedHeight > 0;
            const isValidQuality = parsedQuality !== null;

            const resolution_type =
                isValidWidth && isValidHeight ? 'custom' : 'original';

            const safeQuality = isValidQuality ? parsedQuality : 100;

            const quality_bucket =
                safeQuality >= 90 ? 'high' :
                    safeQuality >= 60 ? 'medium' :
                        'low';

            TelemetryService.logTelemetryEvent(
                ANALYTICS_EVENTS.SETTINGS_CHANGED,
                {
                    resolution_type,
                    quality_bucket,
                    remove_metadata: removeMetadata ? 'true' : 'false',

                    width: isValidWidth ? parsedWidth : undefined,
                    height: isValidHeight ? parsedHeight : undefined,
                    quality: safeQuality,
                }
            );
        } catch (err) {
            console.error("Analytics log event failed", err)
        }

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate(APP_ROUTES.HOME_FEATURE.HOME_MAIN);
        }
    };

    return (
        <Screen>
            <ScrollScreen
                contentContainerStyle={[
                    styles.container,
                ]}
            >
                <ScreenHeading>Download Settings</ScreenHeading>

                {/* WIDTH */}
                <View style={[styles.inputWraper, { borderBlockColor: theme.border }]}>
                    <Text style={styles.inputNameHeading}>Width (px)</Text>
                    <TextInput
                        placeholder={"e.g. 1080"}
                        value={width}
                        onChangeText={setWidth}
                        keyboardType="number-pad"
                        inputMode="numeric"
                    />
                    <Text style={[styles.note, { color: theme.textDim }]}>
                        Leave empty to keep the original width.
                    </Text>
                </View>

                {/* HEIGHT */}
                <View style={[styles.inputWraper, { borderBlockColor: theme.border }]}>
                    <Text style={styles.inputNameHeading}>Height (px)</Text>
                    <TextInput
                        placeholder={"e.g. 1920"}
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="number-pad"
                        inputMode="numeric"
                    />
                    <Text style={[styles.note, { color: theme.textDim }]}>
                        Leave empty to keep the original height (auto).
                    </Text>
                </View>

                {/* QUALITY */}
                <View style={[styles.inputWraper, { borderBlockColor: theme.border }]}>
                    <Text style={styles.inputNameHeading}>Image Quality (%)</Text>
                    <TextInput
                        placeholder={"1 - 100"}
                        value={quality}
                        onChangeText={setQuality}
                        keyboardType="number-pad"
                        inputMode="numeric"
                    />
                    <Text style={[styles.note, { color: theme.textDim }]}>
                        Higher values give better quality but larger file size. (1 ~ 100)
                    </Text>
                </View>

                {/* REMOVE METADATA */}
                <View style={[styles.inputWraper, { borderBlockColor: theme.border }]}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap"
                    }}>
                        <Text style={styles.inputNameHeading}>Remove Metadata</Text>
                        <AppSwitch
                            value={removeMetadata}
                            onValueChange={setRemoveMetadata}
                        />
                    </View>
                    <Text style={[styles.note, { color: theme.textDim }]}>
                        Removes hidden information like location and device details from the file.
                        {"\n"}(Note: Some devices may always remove metadata during processing.)
                    </Text>
                </View>

                {/* reset settings  */}
                <TouchableOpacity onPress={reset} style={{ alignItems: "center" }}>
                    <Text style={{ color: theme.primary, fontSize: 15, fontWeight: "500" }}>Reset settings</Text>
                </TouchableOpacity>

            </ScrollScreen>

            {/* SAVE BUTTON */}
            <Button
                title="Save & Back"
                style={{ borderRadius: 0 }}
                onPress={handleSave}
            />
        </Screen>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    screenHeading: {
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: .5,
        padding: 5,
        marginBottom: 10,
    },

    inputWraper: {
        gap: 5,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },

    inputNameHeading: {
        fontWeight: "500",
        fontSize: 16,
        letterSpacing: .4,
    },

    note: {
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: .5,
    }
});