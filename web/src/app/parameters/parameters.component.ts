import { Component, OnInit } from '@angular/core';

import { Parameter } from '../../x-shared/app/parameters/parameter.model';
import { ParameterService } from '../../x-shared/app/parameters';
import { BackendService } from '../../x-shared/app/core';

import { Logger } from '../../x-shared/app/shared';

import { ParameterListComponent } from './parameter-list';

@Component({
    selector: 'parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {
    parameterTypeDefaultValue: string = 'STRING'; // sorry for that, I didn't find a better way
    parameterName: string = '';
    parameterDescription: string = '';
    parameterType: string = this.parameterTypeDefaultValue;
    parameterValue: string = '';
    parameterTypeHTML: string = 'text';
    parameterTypeHTMLpattern: string = ' ';

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(private _store: ParameterService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    showAddParameterForm() {
        document.getElementById('addParameterForm').style.display='flex';
    }

    hideAddParameterForm() {
        document.getElementById('addParameterForm').style.display='none';
    }


    updateType() {
        if(this.parameterType=='URL') {
            this.parameterTypeHTML = 'url';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='PATH') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='COLOR') {
            this.parameterTypeHTML = 'color';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='DATE_TIME') {
            this.parameterTypeHTML = 'datetime-local';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='TIME') {
            this.parameterTypeHTML = 'time';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='DATE') {
            this.parameterTypeHTML = 'date';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='DOUBLE') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = '\\d+(\\.\\d||,\\d)?\\d*';
        }
        else if(this.parameterType=='INTEGER') {
            this.parameterTypeHTML = 'number';
            this.parameterTypeHTMLpattern = '\d+';
        }
        else if(this.parameterType=='BOOLEAN') {
            this.parameterTypeHTML = 'checkbox';
            this.parameterTypeHTMLpattern = '*';
        }
        else if(this.parameterType=='STRING') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = '*';
        }
        else {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = '*';
        }
    }

    add() {
        if (this.parameterName.trim() === '' 
        || this.parameterType.trim() === '' 
        || this.parameterValue.trim() === '' ) {
            alert('Enter a parameter item');
            return;
        }

        this._store.add(this.parameterName, this.parameterDescription, this.parameterType, this.parameterValue).then(() => {
            this.parameterName = '';
            this.parameterType = this.parameterTypeDefaultValue;
            this.parameterDescription = '';
            this.parameterValue = '';
        }, (error) => {
            if (Logger.isEnabled) {
                Logger.dir(error);
            }
            alert('An error occurred while adding a parameter to your list.');
        });
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
