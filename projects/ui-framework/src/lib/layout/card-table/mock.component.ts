import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'b-mock',
  template: `
    <div #slot1 class="slot-1" [ngStyle]="slot1css" *ngIf="hasSlots[0]">
      <ng-content select="[slot1]"></ng-content>
    </div>
    <div #slot2 class="slot-2" [ngStyle]="slot2css" *ngIf="hasSlots[1]">
      <ng-content select="[slot2]"></ng-content>
    </div>
    <div #slot3 class="slot-3" [ngStyle]="slot3css" *ngIf="hasSlots[2]">
      <ng-content select="[slot3]"></ng-content>
    </div>
    <div #slot4 class="slot-4" [ngStyle]="slot4css" *ngIf="hasSlots[3]">
      <ng-content select="[slot4]"></ng-content>
    </div>
  `,
  styles: []
})
export class MockComponent implements AfterViewInit {
  constructor() {}

  @HostBinding('style') @Input() hostcss = {};

  @Input() slot1css = {};
  @Input() slot2css = {};
  @Input() slot3css = {};
  @Input() slot4css = {};

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('slot1') slot1: ElementRef;
  @ViewChild('slot2') slot2: ElementRef;
  @ViewChild('slot3') slot3: ElementRef;
  @ViewChild('slot4') slot4: ElementRef;

  hasSlots = [false, false, false, false];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasSlots[0] =
        this.slot1.nativeElement.children.length !== 0 ? true : false;
      this.hasSlots[1] =
        this.slot2.nativeElement.children.length !== 0 ? true : false;
      this.hasSlots[2] =
        this.slot3.nativeElement.children.length !== 0 ? true : false;
      this.hasSlots[3] =
        this.slot4.nativeElement.children.length !== 0 ? true : false;
    }, 0);
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}
