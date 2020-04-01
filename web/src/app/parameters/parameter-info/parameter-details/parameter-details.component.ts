import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Parameter, ParameterType, ParameterService } from '@xapp/parameters';

@Component({
    selector: 'app-parameter-details',
    templateUrl: './parameter-details.component.html',
    styleUrls: ['./parameter-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterDetailsComponent implements OnInit {
    @Input() parameter: Parameter;
    @Output() patternChange: EventEmitter<string> = new EventEmitter<string>();

    parameterTypes: Array<String> = [];

    parameterValuePlaceHolder = ' ';
    parameterTypeHtml = 'text';
    parameterTypeHtmlPattern: string = Parameter.STRING_REGEX;

    isDateInputSupported = false;
    isDateTimeInputSupported = false;
    isTimeInputSupported = false;

    constructor(public store: ParameterService) {
    }

    ngOnInit() {
        // Test html5 input types
        const test = document.createElement('input');
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

        for (const enumMember in ParameterType) {
            if (ParameterType.hasOwnProperty(enumMember)) {
                const element = ParameterType[enumMember];
                const isValueProperty = parseInt(enumMember, 10) >= 0;
                if (isValueProperty) {
                    this.parameterTypes.push(element);
                }
            }
        }

        this.updateType();
    }

    updateType() {
        switch (this.parameter.type) {
            case 'URL':
                this.parameterTypeHtml = 'url';
                this.parameterTypeHtmlPattern = Parameter.URL_REGEX;
                this.parameterValuePlaceHolder = 'http://www.mysite.com/';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = '';
                }
                break;

            case 'PATH':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = Parameter.PATH_REGEX;
                this.parameterValuePlaceHolder = '/path/to/my/files';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = '';
                }
                break;

            case 'COLOR':
                this.parameterTypeHtml = 'color';
                this.parameterTypeHtmlPattern = Parameter.COLOR_REGEX;
                this.parameterValuePlaceHolder = '#RRGGBB';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = '';
                }
                break;

            case 'DATE_TIME':
                this.parameterTypeHtml = 'datetime-local';
                if (!this.isDateTimeInputSupported) {
                    this.parameterTypeHtmlPattern = Parameter.DATE_TIME_REGEX;
                    this.parameterValuePlaceHolder = 'YYYY-MM-DD hh:mm';
                    if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                        this.parameter.value = '';
                    }
                }
                break;

            case 'TIME':
                this.parameterTypeHtml = 'TIME';
                if (!this.isTimeInputSupported) {
                    this.parameterTypeHtmlPattern = Parameter.TIME_REGEX;
                    this.parameterValuePlaceHolder = 'hh:mm';
                    if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                        this.parameter.value = '';
                    }
                }
                break;

            case 'DATE':
                this.parameterTypeHtml = 'DATE';
                if (!this.isDateInputSupported) {
                    this.parameterTypeHtmlPattern = Parameter.DATE_REGEX;
                    this.parameterValuePlaceHolder = 'YYYY-MM-DD';
                    if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                        this.parameter.value = '';
                    }
                }
                break;

            case 'DOUBLE':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = Parameter.DOUBLE_REGEX;
                this.parameterValuePlaceHolder = ' ';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = 0.0;
                }
                break;

            case 'INTEGER':
                this.parameterTypeHtml = 'number';
                this.parameterTypeHtmlPattern = Parameter.INTEGER_REGEX;
                this.parameterValuePlaceHolder = ' ';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = 0;
                }
                break;

            case 'BOOLEAN':
                this.parameterTypeHtml = 'checkbox';
                this.parameterTypeHtmlPattern = Parameter.BOOLEAN_REGEX;
                this.parameterValuePlaceHolder = ' ';
                if (!(this.parameter.value instanceof Boolean) && (this.parameter.value !== 'true')) {
                    this.parameter.value = false;
                }
                break;

            case 'STRING':
                this.parameterTypeHtml = 'text';
                this.parameterTypeHtmlPattern = Parameter.STRING_REGEX;
                this.parameterValuePlaceHolder = ' ';
                if (!Parameter.isValueValid(this.parameter.value, this.parameterTypeHtmlPattern)) {
                    this.parameter.value = '';
                }
                break;

            case 'ANY':
            default:
                this.parameterTypeHtml = '';
                this.parameterTypeHtmlPattern = Parameter.ANY_REGEX;
                this.parameterValuePlaceHolder = ' ';

        }
        this.patternChange.emit(this.parameterTypeHtmlPattern);
    }

}
