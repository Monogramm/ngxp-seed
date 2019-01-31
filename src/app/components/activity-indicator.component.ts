import { Component, Input } from '@angular/core';

@Component({
  selector: 'activity-indicator',
  template: `
    <div [class.hidden]="!isLoading">
      <i class="icon-rotate"></i>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    div {
      position: fixed;
      bottom: 0;
      right: 0;
      padding: 0.5em;
      background: white;
      border: solid 1px #c8cccf;
      border-width: 1px 0 0 1px;
      display: flex;
    }
    i {
      font-size: 4em;
    }
    span {
      line-height: 4em;
    }
  `]
})
export class ActivityIndicator {
  @Input('isLoading') isLoading = false;
  @Input('message') message = 'Loading';
}
