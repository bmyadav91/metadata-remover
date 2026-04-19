import { storage } from "@/infrastructure/storage";
import type { InstallReferrerType } from "@/types/InstallReferrer";

const CACHE_KEY = 'install_referrer';
export const MAX_RETRIES = 3;

const read = (): InstallReferrerType | null => {
    try {
        const value = storage.getString(CACHE_KEY);
        if (!value) return null;

        const parsed = JSON.parse(value);

        // basic shape guard (prevents weird crashes later)
        if (typeof parsed !== 'object' || parsed === null) return null;

        return parsed as InstallReferrerType;
    } catch (e) {
        console.log('Referrer read error:', e);
        return null;
    }
};

const write = (value: InstallReferrerType): void => {
    try {
        storage.set(CACHE_KEY, JSON.stringify(value));
    } catch (e) {
        console.log('Referrer write error:', e);
    }
};

export const getInstallReferrerCache = (): InstallReferrerType | null => {
    return read();
};

export const setInstallReferrerCache = (
    value: InstallReferrerType
): void => {
    if (!value) return;

    const existing = read() ?? {};

    write({
        ...existing,
        ...value,
    });
};

export const markReferrerTracked = (): void => {
    const existing = read() ?? {};

    if (existing.is_tracked) return;

    write({
        ...existing,
        is_tracked: true,
    });
};

export const isReferrerTracked = (): boolean => {
    return read()?.is_tracked ?? false;
};

export const getReferrerRetryCount = (): number => {
    return read()?.retry_count ?? 0;
};

export const incrementReferrerRetry = (): void => {
    const existing = read() ?? {};

    write({
        ...existing,
        retry_count: (existing.retry_count ?? 0) + 1,
    });
};