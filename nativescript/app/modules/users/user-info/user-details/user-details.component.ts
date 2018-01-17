import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import * as utils from 'utils/utils';

import { UserService, User } from '../../../../x-shared/app/users';

import { alert } from '../../../shared';

declare var UIColor: any;

@Component({
    selector: 'mg-user-details',
    moduleId: module.id,
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
    @Input() user: User;

    constructor(public store: UserService) {
    }
}

