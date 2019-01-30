import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Pagination } from '../shared/models/pagination';

@Component({
  selector: 'pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
})
export class PaginationControls {
  @Output('page-change') pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input('pagination') pagination: Pagination;
  
  @Input('first-label') firstLabel: string = 'First';
  @Input('prev-label') prevLabel: string = 'Previous';
  @Input('next-label') nextLabel: string = 'Next';
  @Input('last-label') lastLabel: string = 'Last';

  select(page: number) {
    this.pageChange.emit(page);
  }
}
