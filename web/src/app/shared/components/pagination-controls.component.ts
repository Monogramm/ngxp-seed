import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Pagination } from '@xapp/shared';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
})
export class PaginationControlsComponent {
  @Input('pagination') pagination: Pagination;

  @Input() first = 'First';
  @Input() prev = 'Previous';
  @Input() next = 'Next';
  @Input() last = 'Last';

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  select(page: number) {
    this.change.emit(page);
  }
}
