import { AppService } from '../app.service';

export function alert(message: string, title?: string) {
    alert(
        message,
        title || AppService.APP_NAME,
    );
}
