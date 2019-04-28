import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  CardsData,
  AddCardData,
  CardData,
  CardClickEvent
} from '../cards.interface';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss']
})
export class CardsLayoutComponent implements OnInit {
  constructor() {}

  @Input() cards: CardsData;
  @Input() addCard: AddCardData;
  @Input() type: CardType = CardType.primary;

  @Output() cardClicked: EventEmitter<CardClickEvent> = new EventEmitter<
    CardClickEvent
  >();

  ngOnInit() {}

  onCardClicked(card: CardData, index: number): void {
    this.cardClicked.emit({
      card: card,
      cardIndex: index
    });
  }
}
