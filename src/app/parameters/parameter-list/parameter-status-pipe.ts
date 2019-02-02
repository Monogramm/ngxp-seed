import { Pipe, PipeTransform } from '@angular/core';

import { Parameter } from '../../data';

@Pipe({
    name: 'parameterStatus'
})
export class ParameterStatusPipe implements PipeTransform {
    value: Array<Parameter> = [];
    transform(items: Array<Parameter>, selected: boolean) {
        if (items && items.length) {
            this.value = items.filter((parameter: Parameter) => {
                return parameter.selected === selected;
            });
        } else {
            this.value = [];
        }
        return this.value;
    }
}