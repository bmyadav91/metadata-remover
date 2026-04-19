import {
    getAnalytics,
    setAnalyticsCollectionEnabled,
    logEvent,
} from '@react-native-firebase/analytics';

import {
    getCrashlytics,
    setCrashlyticsCollectionEnabled,
    recordError,
    log,
    crash
} from '@react-native-firebase/crashlytics';

import type { consentType } from '@/types/consent';
import { useConsentStore } from '@/state/consent/useConsentStore';

// app 
import { AppError } from "@/app/AppError";



export const ANALYTICS_EVENTS = {
    // User Actions
    INSTALL_ATTRIBUTION: 'install_attribution',
    FILE_SELECTED: 'file_selected',
    FILE_SELECTION_CANCELLED: 'file_selection_cancelled',
    SETTINGS_CHANGED: 'settings_changed',

    // Permissions
    PERMISSION_REQUESTED: 'permission_requested',
} as const;

export type EventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

const IGNORED_SCREENS = new Set([
    'Stack',
    'Tabs',
    'Root',
    'Unknown',
    'Error',
    'MainLayout', // Add any other navigator wrappers
]);

export class TelemetryService {
    // single in-memory reference
    private static consent = useConsentStore?.getState()?.consent;
    private static isDev = __DEV__;
    private static isInitialized = false;
    private static lastTrackedScreen: string | undefined;

    static async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        try {
            await this.applyConsent(this.consent, this.isDev);

            useConsentStore.subscribe(
                (state) => state.consent,
                (consent) => {
                    console.log("📝 new consent: ", consent);
                    this.consent = consent;
                    void this.applyConsent(consent, this.isDev);
                }
            );

        } catch (error) {
            console.error('❌ TelemetryService: init failed', error);
        }
    }

    private static async applyConsent(consent: consentType, isDev: boolean) {
        const analyticsEnabled = Boolean(consent?.is_analytics_enabled);
        const crashlyticsEnabled = Boolean(consent?.is_crashlytics_enabled);

        if (isDev) {
            await setAnalyticsCollectionEnabled(getAnalytics(), false);
            await setCrashlyticsCollectionEnabled(getCrashlytics(), false);
            return;
        }

        await setAnalyticsCollectionEnabled(getAnalytics(), analyticsEnabled);
        await setCrashlyticsCollectionEnabled(getCrashlytics(), crashlyticsEnabled);
    }

    static async logTelemetryEvent(
        eventName: EventName,
        params: Record<string, any> = {}
    ): Promise<boolean> {
        try {
            if (this.isDev) {
                console.log(`🛢️ [ANALYTICS EVENT]: ${eventName}`, params);
                // return false;
            }

            if (!this.consent?.is_analytics_enabled) {
                console.log("⚠️ logTelemetryEvent consent denied");
                return false;
            };

            await logEvent(getAnalytics(), eventName, params);
            return true;

        } catch (error) {
            console.error('❌ TelemetryService: logTelemetryEvent failed', error);
            return false;
        }
    }

    static async logScreen(screenName: string): Promise<boolean> {
        try {

            if (this.isDev) {
                console.log(`📊 Screen View: ${screenName}`);
                // return false;
            }

            if (!this.consent?.is_analytics_enabled) {
                console.log("⚠️ logScreen consent denied");
                return false;
            } else if (!screenName) {
                console.log("🚫 logScreen no valid screen name received");
                return false;
            } else if (IGNORED_SCREENS.has(screenName)) {
                console.log("⚠️ logScreen -> ignore this screen because it is in IGNORED_SCREENS", screenName);
                return false;
            }

            if (this.lastTrackedScreen === screenName) {
                console.log("⚠️ same screen skipped: ", screenName);
                return false;
            };
            this.lastTrackedScreen = screenName;

            await logEvent(getAnalytics(), 'screen_view', {
                screen_name: screenName,
                screen_class: screenName,
            });

            return true;

        } catch (error) {
            console.error(`❌ TelemetryService: logScreen failed`, error);
            return false;
        }
    }

    static async recordHandledError(
        error: Error,
        breadcrumbContext?: string
    ): Promise<boolean> {
        try {

            if (this.isDev) {
                console.error(`⚠️ [CRASH]: ${breadcrumbContext || ''}`, error);
                // return false;
            }

            if (!this.consent?.is_crashlytics_enabled) {
                console.log("recordHandledError consent denied");
                return false;
            };

            // skip expected errors
            if (error instanceof AppError && error?.isExpected) {
                console.log("Expected Error received and ignored.");
                return false;
            }

            const crashlyticsInstance = getCrashlytics();

            if (breadcrumbContext) {
                log(crashlyticsInstance, breadcrumbContext);
            }

            recordError(crashlyticsInstance, error);

            return true;

        } catch (err) {
            console.error('❌ TelemetryService: recordHandledError failed', err);
            return false;
        }
    }

    static triggerTestCrash() {
        crash(getCrashlytics());
    }
}