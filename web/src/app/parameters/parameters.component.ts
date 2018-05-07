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
    parameterTypeURLRegex = '.*';
    parameterTypePATHRegex = '.*';
    parameterTypeCOLORRegex = '^\\#[0-9A-F]{6,8}$';
    parameterTypeTIMERegex = '^[0-2]?[0-9]\\:[0-5]?[0-9]$';
    parameterTypeDATERegex = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9]$';
    parameterTypeDATE_TIMERegex = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9] [0-2]?[0-9]\\:[0-5]?[0-9]$';
    parameterTypeDOUBLERegex = '^\\d+(\\.\\d||,\\d)?\\d*$';
    parameterTypeINTEGERRegex = '^\\d+$';
    parameterTypeBOOLEANRegex = '^[0-1]?$';
    parameterTypeSTRINGRegex = '.*';

    parameterTypeDefaultValue: string = 'STRING'; // sorry for that, I didn't find a better way
    parameterName: string = '';
    parameterDescription: string = '';
    parameterType: string = this.parameterTypeDefaultValue;
    parameterValue: object = null;
    parameterValuePlaceHolder: string = ' ';
    parameterTypeHTML: string = 'text';
    parameterTypeHTMLpattern: string = this.parameterTypeSTRINGRegex;

    isDateInputSupported: boolean = false;
    isDateTimeInputSupported: boolean = false;
    isTimeInputSupported: boolean = false;

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(private _store: ParameterService) { }

    ngOnInit() {
        this.isLoading = true;
        // test html5 input types
        var test = document.createElement('input');
        test.type = 'date';
        if(test.type === 'date') {
            this.isDateInputSupported = true;
        }
        test.type = 'datetime-local';
        if(test.type === 'datetime-local') {
            this.isDateTimeInputSupported = true;
        }
        test.type = 'time';
        if(test.type === 'time') {
            this.isTimeInputSupported = true;
        }
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

    pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
    }

    updateType() {
        if(this.parameterType=='URL') {
            this.parameterTypeHTML = 'url';
            this.parameterTypeHTMLpattern = this.parameterTypeURLRegex;
            this.parameterValue = new String();
            this.parameterValuePlaceHolder = 'http://www.mysite.com/';
        }
        else if(this.parameterType=='PATH') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypePATHRegex;
            this.parameterValue = new String();
            this.parameterValuePlaceHolder = ' ';
            this.parameterValuePlaceHolder = '/path/to/my/files';
        }
        else if(this.parameterType=='COLOR') {
            this.parameterTypeHTML = 'color';
            this.parameterTypeHTMLpattern = this.parameterTypeCOLORRegex;
            this.parameterValue = new String();
            this.parameterValuePlaceHolder = '#000000';
        }
        else if(this.parameterType=='DATE_TIME') {            
            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() +
                  '-' + this.pad(this.getUTCMonth() + 1) +
                  '-' + this.pad(this.getUTCDate()) +
                  ' ' + this.pad(this.getUTCHours()) +
                  ':' + this.pad(this.getUTCMinutes()) ;
                };
            this.parameterTypeHTML = 'datetime-local';
            if(this.isDateTimeInputSupported) {  
                this.parameterValue = new Date();
            }
            else {
                this.parameterTypeHTMLpattern = this.parameterTypeDATE_TIMERegex;
                this.parameterValuePlaceHolder = 'YYYY-MM-DD hh:mm';                
            }
        }
        else if(this.parameterType=='TIME') {           
            Date.prototype.toISOString = function() {
                return this.pad(this.getUTCHours()) +
                  ':' + this.pad(this.getUTCMinutes()) ;
              };
            this.parameterTypeHTML = 'TIME';
            if(this.isTimeInputSupported) {  
                this.parameterValue = new Date();
            }
            else {
                this.parameterTypeHTMLpattern = this.parameterTypeTIMERegex;
                this.parameterValuePlaceHolder = 'hh:mm';
            }
        }
        else if(this.parameterType=='DATE') {
            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() +
                  '-' + this.pad(this.getUTCMonth() + 1) +
                  '-' + this.pad(this.getUTCDate()) ;
              };
            this.parameterTypeHTML = 'DATE';
            if(this.isDateInputSupported) {  
                this.parameterValue = new Date();
            }
            else {
                this.parameterTypeHTMLpattern = this.parameterTypeDATERegex;
                this.parameterValuePlaceHolder = 'YYYY-MM-DD';
            }  
        }
        else if(this.parameterType=='DOUBLE') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeDOUBLERegex;
            this.parameterValue = new Number();
            this.parameterValuePlaceHolder = ' ';
        }
        else if(this.parameterType=='INTEGER') {
            this.parameterTypeHTML = 'number';
            this.parameterTypeHTMLpattern = this.parameterTypeINTEGERRegex;
            this.parameterValue = new Number();
            this.parameterValuePlaceHolder = ' ';
        }
        else if(this.parameterType=='BOOLEAN') {
            this.parameterTypeHTML = 'checkbox';
            this.parameterTypeHTMLpattern = this.parameterTypeBOOLEANRegex;
            this.parameterValue = new Boolean();
            this.parameterValuePlaceHolder = ' ';
        }
        else if(this.parameterType=='STRING') {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeSTRINGRegex;
            this.parameterValue = new String();
            this.parameterValuePlaceHolder = ' ';
        }
        else {
            this.parameterTypeHTML = 'text';
            this.parameterTypeHTMLpattern = this.parameterTypeSTRINGRegex;
            this.parameterValue = new String();
            this.parameterValuePlaceHolder = ' ';
        }
    }

    checkInputValue(event) {
        if(this.parameterType=='INTEGER') {
            var keyCode = event.keyCode;
            console.log("new event:"+event+"-Keycode:"+event.keyCode);
            if (keyCode != 8 &&
                keyCode!= 46 &&
                (keyCode < 96 || keyCode > 105)&&
                (keyCode < 37 || keyCode > 40)) {
                    console.log("false");
                return false;
            }
            return true;
        }

        return true;
    } 

    add() {
        if (this.parameterName.trim() === '' 
        || String(this.parameterValue).trim() === '' 
        || String(this.parameterValue).trim().length == 0 ) {
            alert('Enter a parameter item');
            return;
        }
        // checking if data format match selected type
        var reg = new RegExp(this.parameterTypeHTMLpattern, 'i');
        if(!reg.test(String(this.parameterValue).trim())) {
            alert('Value doesn\'t match selected type');
            return;
        }
        else {
            this._store.add(this.parameterName, this.parameterDescription, this.parameterType, String(this.parameterValue)).then(() => {
                this.parameterName = '';
                this.parameterType = this.parameterTypeDefaultValue;
                this.parameterDescription = '';
                this.parameterValue = null;
                this.hideAddParameterForm();
            }, (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while adding a parameter to your list.');
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
