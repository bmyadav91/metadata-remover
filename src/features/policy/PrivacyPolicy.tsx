import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// ui 
import { ScrollScreen, Screen, AppIcon, AppSwitch } from '@/shared/ui';
import { useTheme } from '@/shared/theme/useTheme';

// constants 
import { APP_CONSTANTS } from '@/constants/appConstants';

// hooks 
import { useConsentStore } from '@/state/consent/useConsentStore';

export function PrivacySettingsScreen() {
    const theme = useTheme();

    const consent = useConsentStore((s) => s.consent);
    const setConsent = useConsentStore((s) => s.setConsent);

    const isEnabled = !!consent.is_analytics_enabled;

    const toggle = () => {
        setConsent({
            is_analytics_enabled: !isEnabled,
            is_crashlytics_enabled: !isEnabled,
        });
    };

    return (
        <Screen>
            <ScrollScreen contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <AppIcon name="LockKeyhole" size={50} color={theme.primary} />
                    <Text style={[styles.title, { color: theme.text }]}>Privacy & Security</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.border, borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.primary }]}>100% Local Processing</Text>
                    <Text style={[styles.cardText, { color: theme.text }]}>
                        Your files never leave this device. All metadata extraction and removal happens
                        in your phone's memory. This app works perfectly without an internet connection.
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.border, borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Analytics & Improvement</Text>
                    <Text style={[styles.cardText, { color: theme.textDim }]}>
                        We use anonymous crash reports and usage data to fix bugs and improve the experience.
                        No personal data or file content is ever collected.
                    </Text>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Share Anonymous Data</Text>
                        <AppSwitch
                            value={isEnabled}
                            onValueChange={toggle}
                        />
                    </View>
                </View>

                <Text style={[styles.footerText, { color: theme.textDim }]}>
                    v{APP_CONSTANTS?.APP_VERSION}
                </Text>
            </ScrollScreen>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
        gap: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardText: {
        fontSize: 15,
        lineHeight: 22,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
    }
});