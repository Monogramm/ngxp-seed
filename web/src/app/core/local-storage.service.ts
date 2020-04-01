import { Injectable } from '@angular/core';

import { StorageService } from '@xapp/core';

@Injectable()
export class LocalStorageService implements StorageService {
    /**
     * Gets a value (if existing) for a key as a String Object.
     *
     * @param key The key to check for.
     * @param defaultValue An optional value to be returned in case there is no existing value.
     */
    getItem(key: string, defaultValue?: string): any {
        const value: any = localStorage.getItem(key);
        return value == null ? defaultValue : value;
    }
    /**
     * Sets an Object for a key.
     *
     * @param key The key.
     * @param value The value.
     */
    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    /**
     * Removes a value (if existing) for a key.
     *
     * @param key The key to check for.
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
    /**
     * Remove all values.
     */
    clear(): void {
        localStorage.clear();
    }
}
