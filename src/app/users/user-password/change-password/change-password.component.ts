import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from '../../../data';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
    @Input() user: User;

    @Input() checkOldPassword: boolean;

    oldPassword: string;

    newPasswordConfirmation: string;

    constructor() {
    }

    get valid(): boolean {
        return !(this.checkOldPassword && this.oldPassword == null)
            && !(this.user.password == null)
            && this.user.password === this.newPasswordConfirmation;
    }
}
