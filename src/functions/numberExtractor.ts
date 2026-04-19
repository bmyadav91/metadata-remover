export const extractNumber = (value: string | number | undefined | null): number | null => {

    if (!value) return null;

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    const stringValue = String(value);
    
    const cleaned = stringValue.replace(/\D/g, "");

    if (cleaned.length > 0) {
        return parseInt(cleaned, 10);
    }

    return null;
};