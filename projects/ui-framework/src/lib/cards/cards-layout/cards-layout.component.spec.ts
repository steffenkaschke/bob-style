import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ChangeDetectionStrategy, NO_ERRORS_SCHEMA} from '@angular/core';
import {CardsLayoutComponent} from './cards-layout.component';
import {CardsModule} from '../cards.module';
import {CardType} from '../cards.enum';

describe('CardsLayoutComponent', () => {
  let fixture: ComponentFixture<CardsLayoutComponent>;
  let component: CardsLayoutComponent;
  let cardsListElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CardsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(CardsLayoutComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardsLayoutComponent);
        fixture.nativeElement.style.width = '950px';
        component = fixture.componentInstance;
        component.type = CardType.regular;
        fixture.detectChanges();
        cardsListElement = fixture.debugElement.query(By.css('.cards-list'))
          .nativeElement;
      });
  }));

  describe('Type', () => {
    it('should be of type primary by default', () => {
      expect(cardsListElement.classList).toContain('cards-regular');
    });
    it('should change type on type input change', () => {
      component.type = CardType.large;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('cards-large');
    });
    it('should change type on type input change', () => {
      component.type = CardType.small;
      fixture.detectChanges();
      expect(cardsListElement.classList).toContain('cards-small');
    });
  });
  describe('cards in a row calculation', () => {
    it('should have 5 cards on 917px container small cards', () => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '917px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(5);
      });
    });
    it('should have 4 cards on 917px container regular cards', () => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '917px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(4);
      });
    });
    it('should have 4 cards on 727px container small cards', () => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '727px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(4);
      });
    });
    it('should have 3 cards on 727px container regular cards', () => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '727px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(3);
      });
    });
    it('should have 3 cards on 600px container small cards', () => {
      component.type = CardType.small;
      fixture.nativeElement.style.width = '600px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(3);
      });
    });
    it('should have 2 cards on 600px container regular cards', () => {
      component.type = CardType.regular;
      fixture.nativeElement.style.width = '600px';
      component.getCardsInRow$().subscribe((numberOfCards) => {
        expect(numberOfCards).toEqual(2);
      });
    });
  });
});
