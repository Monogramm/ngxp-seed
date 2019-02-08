import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Parameter, ParameterDTO, ParameterService } from '../../data';

import { ParameterDetailsComponent } from './parameter-details';

@Component({
    selector: 'app-parameter-info',
    templateUrl: './parameter-info.component.html',
    styleUrls: ['./parameter-info.component.scss']
})
export class ParameterInfoComponent implements OnInit {
    parameter: Parameter;
    parameterTypeHtmlPattern: string = Parameter.STRING_REGEX;
    busy = false;

    constructor(public store: ParameterService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => {
                this.busy = true;
                const entityId = params['id'];
                if (entityId) {
                    return this.store.get(entityId);
                } else {
                    return Observable.create((observer) => {
                        observer.next(null);
                    });
                }
            }))
            .subscribe((data: HttpResponse<ParameterDTO>) => {
                this.busy = false;
                if (data && data.body) {
                    this.parameter = this.store.newModel(data.body);
                } else {
                    this.parameter = new Parameter();
                }
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    const errMsg: string = this._translate.instant('app.message.error.loading');
                    alert(errMsg);
                    this.return();
                });
    }

    delete(parameter: Parameter) {
        const msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            parameter.deleting = true;

            this.busy = true;
            this.store.delete(parameter)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const errMsg: string = this._translate.instant('app.message.error.deletion');
                        alert(errMsg);
                    }
                );
        }
    }

    updateTypePattern(pattern: string) {
        this.parameterTypeHtmlPattern = pattern;
    }

    submit(parameter: Parameter) {
        const name = parameter.name;
        if (name === null || name.trim() === '') {
            const msg: string = this._translate.instant('app.message.warning.missing_field');
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
            const msg: string = this._translate.instant('parameters.message.warning.invalid_value');
            alert(msg);
            return;
        }
        parameter.value = value;

        if (parameter.id === null) {
            this.busy = true;
            this.store.add(parameter)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const errMsg: string = this._translate.instant('app.message.error.creation');
                        alert(errMsg);
                        parameter.value = initialValue;
                    }
                );
        } else {
            this.store.update(parameter)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const errMsg: string = this._translate.instant('app.message.error.update');
                        alert(errMsg);
                        parameter.value = initialValue;
                    }
                );
        }
    }

    return() {
        this.busy = false;
        this._location.back();
    }

}
