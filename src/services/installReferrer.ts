import { PlayInstallReferrer } from 'react-native-play-install-referrer';
import type { InstallReferrerType } from "@/types/InstallReferrer";

import {
    isReferrerTracked,
    markReferrerTracked,
    setInstallReferrerCache,
    MAX_RETRIES,
    getReferrerRetryCount,
    incrementReferrerRetry,

} from '@/cache/installReferrerCache';

import { TelemetryService, ANALYTICS_EVENTS } from '@/services/TelemetryService';


export const handleInstallReferrer = async (): Promise<void> => {
    try {
        if (isReferrerTracked()) {
            // console.log("Install Attribution already tracked.");
            return;
        };

        // 🔒 stop infinite retries
        if (getReferrerRetryCount() >= MAX_RETRIES) {
            markReferrerTracked();
            console.log("Install Attribution max retries reached.", getReferrerRetryCount())
            return;
        }

        const referrer = await fetchInstallReferrer();

        if (!referrer) {
            markReferrerTracked(); // no data → done forever
            console.log("Don't have any referrer.")
            return;
        }

        const parsed = parseReferrer(referrer);

        if (!parsed) {
            markReferrerTracked(); // useless data → done forever
            console.log("parsed return invalid data in install attribution")
            return;
        }

        // ensure cache exists BEFORE retry tracking
        setInstallReferrerCache(parsed);

        const result = await TelemetryService.logTelemetryEvent(
            ANALYTICS_EVENTS.INSTALL_ATTRIBUTION,
            parsed
        );

        if (result) {
            // success → never retry again
            markReferrerTracked();
            console.log("Install attribution log even successfull.")
        } else {
            // failed → retry later (bounded)
            console.log("Install attribution retry later. increase retry count.", getReferrerRetryCount());

            incrementReferrerRetry();
        }

    } catch (e) {
        console.log('Referrer error:', e);

        // optional: count unexpected failures too
        incrementReferrerRetry();
    }
};



const fetchInstallReferrer = (): Promise<string | null> => {
    return new Promise((resolve) => {
        try {
            PlayInstallReferrer.getInstallReferrerInfo((info, error) => {
                if (error || !info?.installReferrer) {
                    resolve(null);
                } else {
                    resolve(info.installReferrer.trim());
                }
            });
        } catch {
            resolve(null);
        }
    });
};




const parseReferrer = (referrer: string): InstallReferrerType | null => {
    try {
        const queryString = referrer.split('?')[1] || referrer;
        const params = new URLSearchParams(queryString);

        const utm_source = params.get('utm_source') ?? params.get('source');
        const utm_medium = params.get('utm_medium') ?? params.get('medium');
        const utm_campaign = params.get('utm_campaign') ?? params.get('campaign');

        const result: InstallReferrerType = {};

        if (utm_source) result.utm_source = utm_source;
        if (utm_medium) result.utm_medium = utm_medium;
        if (utm_campaign) result.utm_campaign = utm_campaign;

        return Object.keys(result).length > 0 ? result : null;
    } catch {
        return null;
    }
};