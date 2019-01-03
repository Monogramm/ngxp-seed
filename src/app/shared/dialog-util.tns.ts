import * as dialogsModule from 'tns-core-modules/ui/dialogs';

import { AppService } from '../app.service';

export function alert(message: string, title?: string) {
    return dialogsModule.alert({
        title: title || AppService.APP_NAME,
        okButtonText: 'OK',
        message: message
    });
}
