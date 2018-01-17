import * as dialogsModule from 'ui/dialogs';

import { AppResources } from '../../x-shared/app/shared/app-resources';

export function alert(message: string, title?: string) {
    return dialogsModule.alert({
        title: title || AppResources.appName,
        okButtonText: 'OK',
        message: message
    });
}
