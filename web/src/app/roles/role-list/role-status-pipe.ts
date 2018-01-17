import { Pipe, PipeTransform } from '@angular/core';

import { Role } from '../../../x-shared/app/roles/role.model';

@Pipe({
    name: 'roleStatus'
})
export class RoleStatusPipe implements PipeTransform {
    value: Array<Role> = [];
    transform(items: Array<Role>, selected: boolean) {
        if (items && items.length) {
            this.value = items.filter((role: Role) => {
                return role.selected === selected;
            });
        }
        return this.value;
    }
}