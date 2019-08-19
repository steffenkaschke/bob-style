import { Component, Input } from '@angular/core';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button
      #button
      type="button"
      class="icon-after {{ buttonType.secondary }} {{ buttonSize.medium }}
                   {{
        (active ? icons.chevron_up : icons.chevron_down) +
          ' b-icon-' +
          iconSize.medium +
          ' b-icon-' +
          iconColor.dark
      }}"
      (click)="onClick($event)"
      [attr.disabled]="disabled || null"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class ChevronButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }

  @Input() active = false;
}
