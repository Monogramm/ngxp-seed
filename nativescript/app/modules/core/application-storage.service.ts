import { Injectable } from '@angular/core';

import { StorageService } from '../../x-shared/app/core';

import * as appSettings from 'application-settings';

@Injectable()
export class ApplicationStorageService extends StorageService {

    getItem(key: string, defaultValue?: string): any {
        return appSettings.getString(key, defaultValue);
    }

    setItem(key: string, value: string): void {
        appSettings.setString(key, value);
    }

    removeItem(key: string): void {
        appSettings.remove(key);
    }

    clear(): void {
        appSettings.clear();
    }
}
