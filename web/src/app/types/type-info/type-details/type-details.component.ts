import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Type, TypeService } from '@xapp/types';

@Component({
    selector: 'app-type-details',
    templateUrl: './type-details.component.html',
    styleUrls: ['./type-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeDetailsComponent {
    @Input() type: Type;

    constructor(public store: TypeService) {
    }
}
