import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CardData, TextOrComponent } from '../cards.interface';
import { CardType } from '../cards.enum';
import { RenderedComponent } from '../../../services/component-renderer/component-renderer.interface';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() card: CardData;
  @Input() type: CardType = CardType.primary;
  @Input() index: number;

  cardType = CardType;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class.focus-inside') menuIsOpened: boolean;

  @HostBinding('class')
  get typeClass() {
    return 'card-' + this.type;
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
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

  onComponentClick($event: any, data: TextOrComponent): void {
    if ((data as RenderedComponent).handlers) {
      $event.stopPropagation();
    }
  }

  stopPropagation($event): void {
    $event.stopPropagation();
  }
}
