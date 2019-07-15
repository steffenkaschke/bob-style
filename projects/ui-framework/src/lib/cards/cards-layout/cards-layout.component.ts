import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';
import {CardType} from '../cards.enum';
import {DOMhelpers} from '../../services/utils/dom-helpers.service';
import {UtilsService} from '../../services/utils/utils.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

const CARD_TYPE_WIDTH = {
  [CardType.small]: 160,
  [CardType.regular]: 190,
  [CardType.large]: 260
};

const GAP_SIZE = 16;

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsLayoutComponent implements AfterViewInit, OnDestroy {

  resizeSubscription: Subscription;

  private cardsInRow$: BehaviorSubject<number>;
  private cardsInRow: number;

  constructor(
    private hostRef: ElementRef,
    private domUtils: DOMhelpers,
    private utilsService: UtilsService,
  ) {
  }

  @Input() type: CardType = CardType.regular;
  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<number>();

  ngAfterViewInit(): void {
    this.hostRef.nativeElement.style.setProperty(`--${this.type}-max-width`, `${CARD_TYPE_WIDTH[this.type]}px`);
    this.calcCardsInRow();
    this.listenToResize();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  listenToResize() {
    this.resizeSubscription = this.utilsService.getResizeEvent().pipe(
    ).subscribe(() => {
      this.calcCardsInRow();
    });
  }

  getCardsInRow$(): Observable<number> {
    this.cardsInRow = this.calcCardsInRow();
    if (!this.cardsInRow$) {
      this.cardsInRow$ = new BehaviorSubject<number>(this.cardsInRow);
      this.resizeSubscription = this.utilsService
        .getResizeEvent()
        .pipe(filter(() => {
          const cardsInRow = this.calcCardsInRow();
          return this.cardsInRow !== cardsInRow;
        }))
        .subscribe(() => {
          this.cardsInRow = this.calcCardsInRow();
          this.cardsInRow$.next(this.cardsInRow);
        });
    }
    return this.cardsInRow$ as Observable<number>;
  }

  private calcCardsInRow(): number {
    const hostWidth = this.domUtils.getInnerWidth(this.hostRef.nativeElement);
    const gaps = (Math.floor(hostWidth / CARD_TYPE_WIDTH[this.type]) - 1) * GAP_SIZE;
    return Math.floor((hostWidth - gaps) / CARD_TYPE_WIDTH[this.type]);
  }
}
