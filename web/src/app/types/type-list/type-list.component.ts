import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../../x-shared/app/shared';
import { Type, TypeService } from '../../../x-shared/app/types';

@Component({
    selector: 'type-list',
    templateUrl: './type-list.component.html',
    styleUrls: ['./type-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    constructor(private _store: TypeService,
        private _router: Router) { }

    ngOnInit() {
        this._store.load()
            .then(() => this.loaded.emit('loaded'));
    }

    imageSource(type: Type) {
        if (type.deleted) {
            return type.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return type.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(type: Type) {
        type.selected = !type.selected;
        return;
    }

    delete(type: Type) {
        if (confirm('Confirm deletion of type "' + type.name + '" ?')) {
            type.deleting = true;

            this._store.delete(type)
                .then(
                () => { type.deleting = false; type.deleted = true; },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting an item from your list.');
                }
                );
        }
    }

    edit(type: Type) {
        this._router.navigate(['/type', type.id]);
    }
}
