import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'b-test-avatar',
  template: `
    <b-avatar
      [imageSource]="imageSource"
      size="small"
      [isClickable]="true"
      (clicked)="onClick($event)"
    >
    </b-avatar>
    <div>
      <strong><ng-content select="[name]"></ng-content></strong>
      <span><ng-content select="[role]"></ng-content></span>
    </div>
  `,
  styles: [
    ':host {display: flex; align-items: center;}',
    'div {display: flex; flex-direction: column; margin-left: 15px;}'
  ]
})
export class TestAvatarUsernameComponent {
  constructor() {}

  @Input() imageSource = '';
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }
}
