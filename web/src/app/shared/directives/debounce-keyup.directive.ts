import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceKeyUp]'
})
export class DebounceKeyUpDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() debounceKeyUp = new EventEmitter();
  private keys = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.keys.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.debounceKeyUp.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('keyup', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.keys.next(event);
  }
}
