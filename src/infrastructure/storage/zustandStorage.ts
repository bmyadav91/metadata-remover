import { createJSONStorage } from 'zustand/middleware';
import { storage } from './';

const storageObject = {
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },

  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },

  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const zustandStorage = createJSONStorage(() => storageObject);