import { Component } from '@angular/core';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-back-button',
  template: `
    <button
      #button
      type="button"
      class="{{ type }} {{ buttonSize.small }} {{
        icons.back_arrow_link +
          ' b-icon-' +
          iconSize.medium +
          ' b-icon-' +
          iconColor.dark
      }}"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class BackButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }
}
