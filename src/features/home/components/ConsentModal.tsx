import React, { useEffect, useState } from 'react';
import { Text, AppIcon, Button } from '@/shared/ui';
import { Modal, View, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { useConsentStore } from '@/state/consent/useConsentStore';


export const ConsentPopup = () => {
    const theme = useTheme();
    const consent = useConsentStore((s) => s.consent);
    const setConsent = useConsentStore((s) => s.setConsent);

    // Listen to the hydration flag
    const _hasHydrated = useConsentStore((s) => s._hasHydrated);

    // If not hydrated yet, return null (prevents the flash)
    if (!_hasHydrated) return null;

    // If already chosen, return null
    if (consent.is_analytics_enabled !== null) return null;



    const handleAccept = () => setConsent({ is_analytics_enabled: true, is_crashlytics_enabled: true });
    const handleDecline = () => setConsent({ is_analytics_enabled: false, is_crashlytics_enabled: false });

    return (
        <Modal transparent animationType="slide" visible={true}>
            <View style={styles.overlay}>

                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.header}>
                        <AppIcon name="LockKeyhole" size={24} color={theme.primary} />
                        <Text style={[styles.title, { color: theme.text }]}>Privacy & Improvement</Text>
                    </View>

                    <Text style={[styles.text, { color: theme.textDim }]}>
                        We use anonymous data to fix bugs and improve the app.
                        Files are processed <Text style={{ fontWeight: 'bold', color: theme.text }}>100% locally</Text> and never leave your phone.
                    </Text>

                    <View style={styles.buttonContainer}>

                        <Button
                            variant='outline'
                            title='Not now'
                            onPress={handleDecline}
                            style={{
                                borderColor: '#E4A11B',
                                borderWidth: 1,
                            }}
                        />

                        <Button
                            title='Agree & Continue'
                            onPress={handleAccept}
                        />

                    </View>
                </View>

            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Dim background
        justifyContent: 'flex-end', // 👈 Change to 'flex-start' if you want it at the top
    },
    card: {
        padding: 24,
        paddingBottom: 40, // Extra padding for bottom-safe area
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 0, // Clean look at the edge
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    primaryButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 150,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    secondaryButton: {
        paddingVertical: 12,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
    },
});