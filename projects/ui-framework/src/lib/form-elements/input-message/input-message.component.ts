import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'b-input-message, [b-input-message]',
  template: `
    {{
      errorMessage && !disabled
        ? errorMessage
        : warnMessage && !errorMessage && !disabled
        ? warnMessage
        : hintMessage
    }}
  `,
  styleUrls: ['./input-message.component.scss']
})
export class InputMessageComponent {
  constructor() {}
  @Input() disabled = false;
  @Input() hintMessage: string;
  @Input() warnMessage: string;
  @Input() errorMessage: string;

  @HostBinding('class')
  get classes(): string {
    return this.disabled
      ? 'disabled '
      : '' +
          (this.errorMessage && !this.disabled
            ? 'error'
            : this.warnMessage && !this.errorMessage && !this.disabled
            ? 'warn'
            : 'hint');
  }
}
