import { Pipe, PipeTransform } from '@angular/core';

import { Media } from '../../data';

@Pipe({
    name: 'mediaStatus'
})
export class MediaStatusPipe implements PipeTransform {
    value: Array<Media> = [];
    transform(items: Array<Media>, selected: boolean) {
        if (items && items.length) {
            this.value = items.filter((media: Media) => {
                return media.selected === selected;
            });
        } else {
            this.value = [];
        }
        return this.value;
    }
}