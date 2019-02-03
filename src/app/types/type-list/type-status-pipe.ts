import { Pipe, PipeTransform } from '@angular/core';

import { Type } from '../../data';

@Pipe({
    name: 'typeStatus'
})
export class TypeStatusPipe implements PipeTransform {
    value: Array<Type> = [];
    transform(items: Array<Type>, selected: boolean) {
        if (items && items.length) {
            this.value = items.filter((type: Type) => {
                return type.selected === selected;
            });
        } else {
            this.value = [];
        }
        return this.value;
    }
}
