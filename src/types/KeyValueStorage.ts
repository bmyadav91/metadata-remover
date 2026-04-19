export type KeyValueStorage = {
    set(key: string, value: string): boolean;
    getString(key: string): string | null;
    remove(key: string): void;
    clear(): void;
}