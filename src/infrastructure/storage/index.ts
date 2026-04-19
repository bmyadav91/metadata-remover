import { mmkvStorage } from "./mmkv";
import { KeyValueStorage } from "@/types/KeyValueStorage";

export const storage: KeyValueStorage = mmkvStorage;