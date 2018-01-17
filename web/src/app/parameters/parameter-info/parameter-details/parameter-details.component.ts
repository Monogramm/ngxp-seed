import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Parameter, ParameterService } from '../../../../x-shared/app/parameters';

@Component({
    selector: 'parameter-details',
    templateUrl: './parameter-details.component.html',
    styleUrls: ['./parameter-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterDetailsComponent {
    @Input() parameter: Parameter;

    constructor(public store: ParameterService) {
    }
}
