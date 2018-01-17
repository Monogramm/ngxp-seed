import { Injectable } from '@angular/core';

import { StorageService } from '../../x-shared/app/core';

@Injectable()
export class LocalStorageService extends StorageService {

    getItem(key: string, defaultValue?: string): any {
        var value: any = localStorage.getItem(key)
        return value == null ? defaultValue : value;
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
