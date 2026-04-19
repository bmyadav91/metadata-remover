export const formatFileSize = (value?: number): string | null => {
    if (value == null || Number.isNaN(value) || value < 0) {
        return null;
    }

    const kb = value / 1024;
    const mb = value / (1024 * 1024);

    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    if (kb >= 1) return `${kb.toFixed(2)} KB`;

    return null;
};