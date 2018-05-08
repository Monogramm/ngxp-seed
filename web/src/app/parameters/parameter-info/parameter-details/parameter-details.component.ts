import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Parameter, ParameterType, ParameterService } from '../../../../x-shared/app/parameters';

@Component({
    selector: 'parameter-details',
    templateUrl: './parameter-details.component.html',
    styleUrls: ['./parameter-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterDetailsComponent implements OnInit {

    private static readonly URL_REGEX = '.*';
    private static readonly PATH_REGEX = '.*';
    private static readonly COLOR_REGEX = '^\\#[0-9A-F]{6,8}$';
    private static readonly TIME_REGEX = '^[0-2]?[0-9]\\:[0-5]?[0-9]$';
    private static readonly DATE_REGEX = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9]$';
    private static readonly DATE_TIME_REGEX = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9] [0-2]?[0-9]\\:[0-5]?[0-9]$';
    private static readonly DOUBLE_REGEX = '^\\d+(\\.\\d||,\\d)?\\d*$';
    private static readonly INTEGER_REGEX = '^\\d+$';
    private static readonly BOOLEAN_REGEX = '^[0-1]?$';
    private static readonly STRING_REGEX = '.*';
    private static readonly ANY_REGEX = '.*';

    @Input() parameter: Parameter;

    @ViewChild('parameterValue') parameterValue: ElementRef;

    parameterTypes: Array<String> = [];

    parameterValuePlaceHolder: string = ' ';
    parameterTypeHtml: string = 'text';
    parameterTypeHtmlPattern: string = ParameterDetailsComponent.STRING_REGEX;

    isDateInputSupported: boolean = false;
    isDateTimeInputSupported: boolean = false;
    isTimeInputSupported: boolean = false;

    constructor(public store: ParameterService) {
    }

    ngOnInit() {
        // Test html5 input types
        var test = document.createElement('input');
        test.type = 'date';
        if (test.type === 'date') {
            this.isDateInputSupported = true;
        }
        test.type = 'datetime-local';
        if (test.type === 'datetime-local') {
            this.isDateTimeInputSupported = true;
        }
        test.type = 'time';
        if (test.type === 'time') {
            this.isTimeInputSupported = true;
        }

        for (var enumMember in ParameterType) {
            var isValueProperty = parseInt(enumMember, 10) >= 0
            if (isValueProperty) {
                this.parameterTypes.push(ParameterType[enumMember]);
            }
        }
    }

    updateType() {
        switch (this.parameter.type) {
            case 'URL':
                this.parameterTypeHtml = 'url';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.URL_REGEX;
                this.parameterValuePlaceHolder = 'http://www.mysite.com/';
                this.parameter.value = '';
                break;

            case 'PATH':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.PATH_REGEX;
                this.parameterValuePlaceHolder = '/path/to/my/files';
                this.parameter.value = '';
                break;

            case 'COLOR':
                this.parameterTypeHtml = 'color';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.COLOR_REGEX;
                this.parameterValuePlaceHolder = '#RRGGBB';
                this.parameter.value = '';
                break;

            case 'DATE_TIME':
                this.parameterTypeHtml = 'datetime-local';
                if (this.isDateTimeInputSupported) {
                    this.parameter.value = new Date();
                } else {
                    this.parameterTypeHtmlPattern = ParameterDetailsComponent.DATE_TIME_REGEX;
                    this.parameterValuePlaceHolder = 'YYYY-MM-DD hh:mm';
                    this.parameter.value = '';
                }
                break;

            case 'TIME':
                this.parameterTypeHtml = 'TIME';
                if (this.isTimeInputSupported) {
                    this.parameter.value = new Date();
                } else {
                    this.parameterTypeHtmlPattern = ParameterDetailsComponent.TIME_REGEX;
                    this.parameterValuePlaceHolder = 'hh:mm';
                    this.parameter.value = '';
                }
                break;

            case 'DATE':
                this.parameterTypeHtml = 'DATE';
                if (this.isDateInputSupported) {
                    this.parameter.value = new Date();
                } else {
                    this.parameterTypeHtmlPattern = ParameterDetailsComponent.DATE_REGEX;
                    this.parameterValuePlaceHolder = 'YYYY-MM-DD';
                    this.parameter.value = '';
                }
                break;

            case 'DOUBLE':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.DOUBLE_REGEX;
                this.parameterValuePlaceHolder = ' ';
                this.parameter.value = 0.0;
                break;

            case 'INTEGER':
                this.parameterTypeHtml = 'number';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.INTEGER_REGEX;
                this.parameterValuePlaceHolder = ' ';
                this.parameter.value = 0;
                break;

            case 'BOOLEAN':
                this.parameterTypeHtml = 'checkbox';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.BOOLEAN_REGEX;
                this.parameterValuePlaceHolder = ' ';
                this.parameter.value = false;
                break;

            case 'STRING':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.STRING_REGEX;
                this.parameterValuePlaceHolder = ' ';
                this.parameter.value = '';
                break;

            case 'ANY':
            default:
                this.parameterTypeHtml = '';
                this.parameterTypeHtmlPattern = ParameterDetailsComponent.ANY_REGEX;
                this.parameterValuePlaceHolder = ' ';
                this.parameter.value = '';


        }
    }

    isValueValid(value: any) {
        var reg = new RegExp(this.parameterTypeHtmlPattern, 'i');
        return value === null || reg.test(String(value).trim());
    }
}
