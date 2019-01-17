import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Parameter, ParameterService } from '../data/parameters';

import { Logger, InputUtils } from '../shared';

import { ParameterListComponent } from './parameter-list';
import { ParameterDetailsComponent } from './parameter-info';

@Component({
    selector: 'parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

    private parameterDetails: ParameterDetailsComponent;

    @ViewChild(ParameterDetailsComponent)
    set appBacon(component: ParameterDetailsComponent) {
        this.parameterDetails = component;
    };

    newParameter: Parameter = new Parameter(null, null, null, null, null);

    isConfirmingAddition = false;

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(
        private _translate: TranslateService,
        private _store: ParameterService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    toggleAddition() {
        this.isConfirmingAddition = !this.isConfirmingAddition;
    }

    cancelAddition() {
        this.isConfirmingAddition = false;
    }

    checkInputValue(event) {
        if (this.newParameter.type == 'INTEGER') {
            var keyCode = event.keyCode;
            console.log("new event:" + event + "-Keycode:" + event.keyCode);
            if (keyCode != 8 &&
                keyCode != 46 &&
                (keyCode < 96 || keyCode > 105) &&
                (keyCode < 37 || keyCode > 40)) {
                console.log("false");
                return false;
            }
            return true;
        }

        return true;
    }

    add() {
        let name = this.newParameter.name;
        if (name === null || name.trim() === '') {
            var msg: string = this._translate.instant('app.message.warning.missing_field');
            alert(msg);
            return;
        }
        name = name.trim();

        let value = this.newParameter.value;
        if (value !== null) {
            value = InputUtils.convertValue(this.newParameter.type, this.newParameter.value);
        }

        // check if data format match selected type
        if (!this.parameterDetails.isValueValid(value)) {
            var msg: string = this._translate.instant('app.message.warning.invalid_format');
            alert(msg);
            return;
        } else {
            this.newParameter.name = name;
            this.newParameter.value = value;

            this._store.add(name, this.newParameter.description, this.newParameter.type, value).then(() => {
                this.newParameter = new Parameter(null, null, null, null, null);
                this.cancelAddition();
            }, (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                var msg: string = this._translate.instant('app.message.error.creation');
                alert(msg);
            });
        }
    }

    cancelMassDelete() {
        this.isConfirmingDeletion = false;
        this._store.updateSelection(this.isConfirmingDeletion);
    }

    toggleMassDelete() {
        if (this.isConfirmingDeletion) {
            let result = this._store.deleteSelection();

            if (result) {
                result.then(
                    () => { this.isConfirmingDeletion = false },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
            } else {
                this.isConfirmingDeletion = false;
            }
        } else {
            this.isConfirmingDeletion = true;
        }
    }
}
