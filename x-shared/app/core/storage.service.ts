
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

export abstract class StorageService {
    /**
     * Gets a value (if existing) for a key as a String Object.
     * 
     * @param key The key to check for.
     * @param defaultValue An optional value to be returned in case there is no existing value.
     */
    abstract getItem(key: string, defaultValue?: string): any;
    /**
     * Sets an Object for a key.
     * 
     * @param key The key.
     * @param value The value.
     */
    abstract setItem(key: string, value: any): void;
    /**
     * Removes a value (if existing) for a key.
     * 
     * @param key The key to check for.
     */
    abstract removeItem(key: string): void;
    /**
     * Remove all values.
     */
    abstract clear(): void;
}
