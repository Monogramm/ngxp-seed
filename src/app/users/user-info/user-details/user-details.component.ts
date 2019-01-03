import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User, UserService } from '../../../data';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
    @Input() user: User;

    constructor(public store: UserService) {
    }
}
