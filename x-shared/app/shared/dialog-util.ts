import { AppResources } from './app-resources';

export function alert(message: string, title?: string) {
    alert(
        message,
        title || AppResources.appName,
    );
}
