import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Parameter, ParameterService } from '../data/parameters';

import { Logger } from '../shared';

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

    constructor(private _store: ParameterService) { }

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
            alert('Enter a parameter item');
            return;
        }
        name = name.trim();

        let value = this.newParameter.value;
        if (value !== null) {
            value = this.convertValue(this.newParameter.type, this.newParameter.value);
        }

        // check if data format match selected type
        if (!this.parameterDetails.isValueValid(value)) {
            alert('Value "' + value + '" doesn\'t match selected type format.');
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
                alert('An error occurred while adding a parameter to your list.');
            });
        }
    }

    private convertValue(type: string, value: any): any {
        let finalValue: any = null;

        switch (type) {
            case 'DATE_TIME':
                if (value instanceof Date) {
                    finalValue = value.getUTCFullYear() +
                        '-' + ParametersComponent.pad(value.getUTCMonth() + 1) +
                        '-' + ParametersComponent.pad(value.getUTCDate()) +
                        ' ' + ParametersComponent.pad(value.getUTCHours()) +
                        ':' + ParametersComponent.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'TIME':
                if (value instanceof Date) {
                    finalValue = ParametersComponent.pad(value.getUTCHours()) +
                        ':' + ParametersComponent.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'DATE':
                if (value instanceof Date) {
                    finalValue = ParametersComponent.pad(value.getUTCMonth()) +
                        ':' + ParametersComponent.pad(value.getUTCDate());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'BOOLEAN':
                if (typeof value === 'boolean') {
                    finalValue = value ? 1 : 0;
                } else {
                    finalValue = String(value).trim();
                }
                break;

            default:
                finalValue = String(value).trim();

        }

        return finalValue;
    }

    private static pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
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
                        alert('An error occurred while deleting parameters.');
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
