import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Role, RoleService } from '../../../../x-shared/app/roles';

@Component({
    selector: 'role-details',
    templateUrl: './role-details.component.html',
    styleUrls: ['./role-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleDetailsComponent {
    @Input() role: Role;

    constructor(public store: RoleService) {
    }
}
