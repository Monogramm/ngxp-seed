import { isDevMode } from '@angular/core';

/**
 * A shared yet simple way to log messages.
 */
export class Logger {

    static get isEnabled(): boolean {
        return isDevMode();
    }

    static log(message?: any, ...optionalParams: any[]) {
        if (Logger.isEnabled) {
            console.log(new Date().toJSON() + ': ' + message, optionalParams);
        }
    }

    static dir(message?: any, ...optionalParams: any[]) {
        if (Logger.isEnabled) {
            console.dir(message, optionalParams);
        }
    }
}
