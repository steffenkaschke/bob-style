import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-pseudo-input',
  template: `
    <span *ngIf="label" class="bfe-label" data-max-lines="1">
      {{ label }}
    </span>
    <span class="bfe-wrap focused" [attr.data-tooltip]="tooltip || null">
      <span class="bfe-input" data-max-lines="1">
        {{ value }}
      </span>
    </span>
    <span *ngIf="hintMessage" class="input-message hint">
      {{ hintMessage }}
    </span>
  `,
  styleUrls: ['pseudo-input.component.scss'],
})
export class PseudoInputComponent {
  constructor() {}

  @Input() label: string;
  @Input() value: string;
  @Input() hintMessage: string;
  @Input() tooltip: string;
}
