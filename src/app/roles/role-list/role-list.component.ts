import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Role, RoleService } from '../../data';

@Component({
    selector: 'role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    constructor(public store: RoleService,
        private _translate: TranslateService,
        private _router: Router) { }

    ngOnInit() {
        this.store.load()
            .then(
                () => this.loaded.emit('loaded'),
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while loading items.');
                    this.loaded.emit('loaded');
                }
            );
    }

    imageSource(role: Role) {
        if (role.deleted) {
            return role.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return role.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(role: Role) {
        role.selected = !role.selected;
        return;
    }

    delete(role: Role) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            role.deleting = true;

            this.store.delete(role)
                .then(
                    () => { role.deleting = false; role.deleted = true; },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    edit(role: Role) {
        this._router.navigate(['/role', role.id]);
    }
}
