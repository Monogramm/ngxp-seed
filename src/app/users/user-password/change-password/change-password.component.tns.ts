import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../data/users';

@Component({
    selector: 'change-password',
    moduleId: module.id,
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
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
