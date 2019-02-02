import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Parameter, ParameterService } from '../../data';

import { ParameterDetailsComponent } from './parameter-details';

@Component({
    selector: 'parameter-info',
    templateUrl: './parameter-info.component.html',
    styleUrls: ['./parameter-info.component.scss']
})
export class ParameterInfoComponent implements OnInit {
    parameter: Parameter;
    parameterTypeHtmlPattern: string = Parameter.STRING_REGEX;

    constructor(public store: ParameterService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => {
                var entityId = params['id'];
                if (entityId) {
                    return this.store.get(params['id']);
                } else {
                    return Promise.resolve();
                }
            }))
            .subscribe((data: any) => {
                if (data) {
                    this.parameter = this.store.newModel(data);
                } else {
                    this.parameter = new Parameter();
                }
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this._location.back();
                });
    }

    delete(parameter: Parameter) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            parameter.deleting = true;

            this.store.delete(parameter)
                .then(
                    () => {
                        this._location.back();
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    updateTypePattern(pattern: string) {
        this.parameterTypeHtmlPattern = pattern;
    }

    submit(parameter: Parameter) {
        let name = parameter.name;
        if (name === null || name.trim() === '') {
            var msg: string = this._translate.instant('app.message.warning.missing_field');
            alert(msg);
            return;
        }
        parameter.name = name.trim();

        const initialValue = parameter.value;
        let value = parameter.value;
        if (value !== null) {
            value = Parameter.convertValue(parameter.type, parameter.value);
        }

        // check if value format match selected type
        if (!Parameter.isValueValid(value, this.parameterTypeHtmlPattern)) {
            var msg: string = this._translate.instant('parameters.message.warning.invalid_value');
            alert(msg);
            return;
        }
        parameter.value = value;

        if (parameter.id === null) {
            this.store.add(parameter)
                .then(
                    () => {
                        this._location.back();
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.creation');
                        alert(msg);
                        parameter.value = initialValue;
                    }
                );
        } else {
            this.store.update(parameter)
                .then(
                    () => {
                        this._location.back();
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.update');
                        alert(msg);
                        parameter.value = initialValue;
                    }
                );
        }
    }

    cancel() {
        this._location.back();
    }

}
