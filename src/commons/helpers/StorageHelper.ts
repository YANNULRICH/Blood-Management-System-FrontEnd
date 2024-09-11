import config from "../../config";
import StorageMode from "../enums/StorageMode";

/**
 * Storage keys list
 */
export enum StorageKeys {
    JWT = 'JWT',
    TMP_MPI = 'TMP_MPI',
    LANGUAGE = 'LANGUAGE',
    USER_USAGER = 'USER_USAGER',
    SCHEDULE_NOTIFICATIONS = 'SCHEDULE_NOTIFICATIONS',
    LOCATION = 'LOCATION'
}

/**
 * Storage manager to help centralizing storage operations
 */
export default class StorageHelper {
    /**
     * Parse string to recognizable storage key
     * @param key
     */
    static parseKey = (key: StorageKeys) => `${config.storagePrefix}${key}`;

    /**
     * Get item from storage
     * @param key
     * @param mode
     */
    static getItem = (key: StorageKeys, mode: StorageMode = StorageMode.LOCAL_STORAGE) : string | null => {
        let item = null;
        if (mode === StorageMode.LOCAL_STORAGE)
            item = localStorage.getItem(StorageHelper.parseKey(key));
        else item = sessionStorage.getItem(StorageHelper.parseKey(key));
        return item || null;
    };

    /**
     * Set item into storage
     * @param key
     * @param value
     * @param mode
     */
    static setItem = (key: StorageKeys, value: string, mode: StorageMode = StorageMode.LOCAL_STORAGE) => {
        if (mode === StorageMode.LOCAL_STORAGE)
            localStorage.setItem(StorageHelper.parseKey(key), value);
        else sessionStorage.setItem(StorageHelper.parseKey(key), value);
    };

    /**
     * Remove item from storage
     * @param key
     * @param mode
     */
    static removeItem = (key: StorageKeys, mode: StorageMode = StorageMode.LOCAL_STORAGE) => {
        if (mode === StorageMode.LOCAL_STORAGE)
            localStorage.removeItem(StorageHelper.parseKey(key));
        else sessionStorage.removeItem(StorageHelper.parseKey(key));
    };
}
