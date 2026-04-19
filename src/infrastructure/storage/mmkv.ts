import { createMMKV } from 'react-native-mmkv';
import { KeyValueStorage } from '@/types/KeyValueStorage';
import { TelemetryService } from '@/services/TelemetryService';

const mmkv = createMMKV({
  id: 'main-storage',
});

export const mmkvStorage: KeyValueStorage = {
  set: (key, value) => {
    try {
      mmkv.set(key, value);
      return true;
    } catch (e) {
      TelemetryService.recordHandledError(
        e as Error,
        `MMKV:set:${key}`
      );

      return false;
    }
  },

  getString: (key) => {
    try {
      return mmkv.getString(key) ?? null;
    } catch (e) {
      TelemetryService.recordHandledError(
        e as Error,
        `MMKV:get:${key}`
      );

      return null;
    }
  },

  remove: (key) => {
    try {
      mmkv.remove(key);
    } catch (e) {
      TelemetryService.recordHandledError(
        e as Error,
        `MMKV:remove:${key}`
      );
    }
  },

  clear: () => {
    try {
      mmkv.clearAll();
    } catch (e) {
      TelemetryService.recordHandledError(
        e as Error,
        `MMKV:clear`
      );
    }
  },
};