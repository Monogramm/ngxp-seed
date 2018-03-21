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

    parameterTypeURLRegex = '.*';
    parameterTypePATHRegex = '.*';
    parameterTypeCOLORRegex = '^\\#[0-9A-F]{6,8}$';
    parameterTypeTIMERegex = '^[0-2]?[0-9]\\:[0-5]?[0-9]$';
    parameterTypeDATERegex = '^[0-3]?[0-9]\/12\/[0-9]{4}$';
    parameterTypeDATE_TIMERegex = '^[0-3]?[0-9]\/12\/[0-9]{4} [0-2]?[0-9]\\:[0-5]?[0-9]$';
    parameterTypeDOUBLERegex = '^\\d+(\\.\\d||,\\d)?\\d*$';
    parameterTypeINTEGERRegex = '^\\d+$';
    parameterTypeBOOLEANRegex = '^[0-1]?$';
    parameterTypeSTRINGRegex = '.*';

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(private _store: ParameterService) { }

    ngOnInit() {
        this.isLoading = true;

        // TODO : if browser supports type=date, take it into account
        // Find date time format according to the user's local
        var testDate = new Date( 2000 , 11 , 13 ); // Parameters: Year, Month, Day
                                                   // Nota : Month start at 0 
        var testDateString = testDate.toLocaleDateString();
        var testDateRegex = testDateString.replace(/\.|:|-|\/|\\/g, function (x) {
            return '\\'.concat(x);
        });
        testDateRegex = testDateRegex.replace('2000', '[0-9]{4}');    // Year
        testDateRegex = testDateRegex.replace('10', '[0-1]?[0-9]');   // Month
        testDateRegex = testDateRegex.replace('13', '[0-3]?[0-9]');   // Day 
        this.parameterTypeDATERegex = '^'.concat(testDateRegex).concat('$');
        this.parameterTypeDATE_TIMERegex = '^'.concat(testDateRegex).concat(' [0-2]?[0-9]\\:[0-5]?[0-9]$');
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    showAddParameterForm() {
        document.getElementById('addParameterForm').style.display='flex';
        document.getElementById('addParameterButton').setAttribute('disabled', 'disabled');
    }

    hideAddParameterForm() {
        document.getElementById('addParameterForm').style.display='none';
        document.getElementById('addParameterButton').removeAttribute('disabled');
    }


    updateType() {
        if(this.parameterType=='URL') {
            this.parameterTypeHTML = 'url';
            this.parameterTypeHTMLpattern = this.parameterTypeURLRegex;
        }
        else if(this.parameterType=='PATH') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypePATHRegex;
        }
        else if(this.parameterType=='COLOR') {
            this.parameterTypeHTML = 'color';
            this.parameterTypeHTMLpattern = this.parameterTypeCOLORRegex;
        }
        else if(this.parameterType=='DATE_TIME') {
            this.parameterTypeHTML = 'datetime-local';
            this.parameterTypeHTMLpattern = this.parameterTypeDATE_TIMERegex;
        }
        else if(this.parameterType=='TIME') {
            this.parameterTypeHTML = 'time';
            this.parameterTypeHTMLpattern = this.parameterTypeTIMERegex;
        }
        else if(this.parameterType=='DATE') {
            this.parameterTypeHTML = 'date';
            this.parameterTypeHTMLpattern = this.parameterTypeDATERegex;
        }
        else if(this.parameterType=='DOUBLE') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeDOUBLERegex;
        }
        else if(this.parameterType=='INTEGER') {
            this.parameterTypeHTML = 'number';
            this.parameterTypeHTMLpattern = this.parameterTypeINTEGERRegex;
        }
        else if(this.parameterType=='BOOLEAN') {
            this.parameterTypeHTML = 'checkbox';
            this.parameterTypeHTMLpattern = this.parameterTypeBOOLEANRegex;
        }
        else if(this.parameterType=='STRING') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeSTRINGRegex;
        }
        else {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeSTRINGRegex;
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
