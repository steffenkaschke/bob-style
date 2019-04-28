import { Component, Input, HostBinding } from '@angular/core';
import { CardData } from '../cards.interface';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() card: CardData;
  @Input() type: CardType = CardType.primary;

  cardType = CardType;

  @HostBinding('class.focus-inside') menuIsOpened: boolean;

  @HostBinding('class')
  get typeClass() {
    return 'card-' + this.type;
  }

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
