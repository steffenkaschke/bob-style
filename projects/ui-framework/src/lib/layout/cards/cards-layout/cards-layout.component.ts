import { Component, OnInit, Input } from '@angular/core';

import { CardsData, AddCardData } from '../cards.interface';
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

  ngOnInit() {}
}
