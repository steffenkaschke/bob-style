import { Component, Input, HostBinding } from '@angular/core';
import { CardData } from '../cards.interface';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() card: CardData;

  @HostBinding('class.focus-inside') menuIsOpened: boolean;

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

  isString(val: any): boolean {
    return val && typeof val === 'string';
  }

  isComponent(obj: any): boolean {
    return obj && !!obj.component;
  }
}
