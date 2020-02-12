import { Component, Input } from '@angular/core';

@Component({
  selector: 'b-pseudo-input',
  template: `
    <span class="bfe-label" data-max-lines="1">
      {{ label }}
    </span>
    <span class="bfe-wrap focused" [attr.data-tooltip]="tooltip || null">
      <span class="bfe-input">
        <span data-max-lines="1">{{ value }}</span>
      </span>
    </span>
  `,
  styleUrls: ['pseudo-input.component.scss'],
})
export class PseudoInputComponent {
  constructor() {}

  @Input() label: string;
  @Input() value: string;
  @Input() tooltip: string;
}
