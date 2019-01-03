import { Injectable } from '@angular/core';

import * as appSettings from 'application-settings';

/**
 * A cached value for the application storage.
 */
export class CachedValue<T> {

    /**
     * The expiration date of the cache entry.
     */
    date: Date;

    constructor(public value: T, date?: Date) {
        this.date = date || new Date();
    }

}

@Injectable()
export class StorageService implements StorageService {
    /**
     * Gets a value (if existing) for a key as a String Object.
     * 
     * @param key The key to check for.
     * @param defaultValue An optional value to be returned in case there is no existing value.
     */
    getItem(key: string, defaultValue?: string): any {
        return appSettings.getString(key, defaultValue);
    }
    /**
     * Sets an Object for a key.
     * 
     * @param key The key.
     * @param value The value.
     */
    setItem(key: string, value: string): void {
        appSettings.setString(key, value);
    }
    /**
     * Removes a value (if existing) for a key.
     * 
     * @param key The key to check for.
     */
    removeItem(key: string): void {
        appSettings.remove(key);
    }
    /**
     * Remove all values.
     */
    clear(): void {
        appSettings.clear();
    }
}
