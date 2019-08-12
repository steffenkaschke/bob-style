import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  NgZone,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  HostBinding,
  OnInit
} from '@angular/core';
import { CardType } from '../cards.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { CARD_TYPE_WIDTH, GAP_SIZE } from './cards-layout.const';
import { BaseCardElement } from '../card/card.abstract';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsLayoutComponent implements OnDestroy, OnChanges, OnInit {
  constructor(
    private hostRef: ElementRef,
    private DOM: DOMhelpers,
    private utilsService: UtilsService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  private resizeSubscription: Subscription;
  private cardsInRow$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  @ContentChildren(BaseCardElement) public cards: QueryList<BaseCardElement>;

  @Input() alignCenter = false;
  @Input() type: CardType = CardType.regular;
  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  @HostBinding('attr.data-mobile-swiper') @Input() mobileSwiper = true;
  @HostBinding('attr.data-cards-in-row') cardsInRow: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type && !changes.type.firstChange) {
      this.type = changes.type.currentValue;
      this.setCssVars();
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.cardsInRow = this.calcCardsInRow();
    this.cardsInRow$.next(this.cardsInRow);
    this.setCssVars();

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .pipe(
        outsideZone(this.zone),
        filter(() => {
          return this.cardsInRow !== this.calcCardsInRow();
        })
      )
      .subscribe(() => {
        this.zone.run(() => {
          this.cardsInRow = this.calcCardsInRow();
          this.cardsInRow$.next(this.cardsInRow);
          if (this.cardsAmountChanged.observers.length > 0) {
            this.cardsAmountChanged.emit(this.cardsInRow);
          }
          this.hostRef.nativeElement.dataset.cardsInRow = this.cardsInRow;
        });
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  getCardsInRow$(): Observable<number> {
    return this.cardsInRow$ as Observable<number>;
  }

  private setCssVars(): void {
    this.DOM.setCssProps(this.hostRef.nativeElement, {
      '--card-width': CARD_TYPE_WIDTH[this.type] + 'px',
      '--card-grid-gap': GAP_SIZE + 'px'
    });
  }

  private calcCardsInRow(): number {
    const hostWidth = this.DOM.getInnerWidth(this.hostRef.nativeElement);
    const gaps =
      (Math.floor(hostWidth / CARD_TYPE_WIDTH[this.type]) - 1) * GAP_SIZE;
    const fullCards = Math.floor(
      (hostWidth - gaps) / CARD_TYPE_WIDTH[this.type]
    );
    return fullCards > 1 ? fullCards : 1;
  }
}
