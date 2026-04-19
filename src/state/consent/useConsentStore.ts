import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { zustandStorage } from '@/infrastructure/storage/zustandStorage';
import { consentType } from '@/types/consent';

interface ConsentState {
    consent: consentType;

    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setConsent: (value: Partial<consentType>) => void;
    reset: () => void;
}

const DEFAULT_CONSENT: consentType = {
    is_analytics_enabled: null,
    is_crashlytics_enabled: null,
};

export const useConsentStore = create<ConsentState>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                consent: DEFAULT_CONSENT,

                _hasHydrated: false,
                setHasHydrated: (state) => set({ _hasHydrated: state }),

                setConsent: (value: Partial<consentType>) =>
                    set({
                        consent: {
                            ...get().consent,
                            ...value,
                        },
                    }),

                reset: () => set({ consent: DEFAULT_CONSENT }),
            }),
            {
                name: 'consent-storage',
                storage: zustandStorage,
                onRehydrateStorage: () => (state) => {
                    state?.setHasHydrated(true);
                },
            },

        )
    )
);