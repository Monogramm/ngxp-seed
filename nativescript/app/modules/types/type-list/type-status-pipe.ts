import { Pipe, PipeTransform } from '@angular/core';

import { Type } from '../../../x-shared/app/types/type.model';

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
        }
        return this.value;
    }
}