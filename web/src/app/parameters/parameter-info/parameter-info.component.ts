import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { Parameter, ParameterService } from '../../../x-shared/app/parameters';

import { ParameterDetailsComponent } from './parameter-details';

@Component({
    selector: 'parameter-info',
    templateUrl: './parameter-info.component.html',
    styleUrls: ['./parameter-info.component.scss']
})
export class ParameterInfoComponent implements OnInit {
    parameter: Parameter;

    constructor(public store: ParameterService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params
            .switchMap((params: Params) => this.store.get(params['id']))
            .subscribe((data: any) => {
                this.parameter = this.store.newModel(data);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading a parameter.');
                this._location.back();
            });
    }

    delete(parameter: Parameter) {
        if (confirm('Confirm deletion of parameter "' + parameter.name + '" ?')) {
            parameter.deleting = true;

            this.store.delete(parameter)
                .then(
                () => { },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting a parameter.');
                }
                );
        }
    }

    submit(parameter: Parameter) {
        if (parameter.id === null) {
            this.store.add(parameter.name)
                .then(
                () => { this._location.back(); },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while adding an parameter.');
                }
                );
        } else {
            this.store.update(parameter)
                .then(
                () => { this._location.back(); },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while updating a parameter.');
                }
                );
        }
    }

    cancel() {
        this._location.back();
    }

}
