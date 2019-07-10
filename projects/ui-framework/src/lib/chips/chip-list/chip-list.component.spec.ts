import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipListComponent } from './chip-list.component';
import { ChipType, ChipListAlign } from '../chips.enum';
import { ChipModule } from '../chip/chip.module';
import {
  elementsFromFixture,
  simpleChange
} from '../../services/utils/test-helpers';
import { ChipComponent } from '../chip/chip.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChipListComponent', () => {
  let component: ChipListComponent;
  let fixture: ComponentFixture<ChipListComponent>;

  let listElement: HTMLElement;
  let chipsElements: HTMLElement[];
  let chipsComponents: ChipComponent[];

  const chips = [
    {
      text: 'A',
      id: 1
    },
    {
      text: 'B',
      id: 2
    },
    {
      text: 'C',
      id: 3
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipListComponent],
      imports: [ChipModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipListComponent);
        component = fixture.componentInstance;
        component.config = {};
        component.chips = chips;
        spyOn(component.clicked, 'emit');
        spyOn(component.removed, 'emit');
        spyOn(component.selected, 'emit');
        spyOn(component.keyPressed, 'emit');
        fixture.detectChanges();

        listElement = fixture.debugElement.nativeElement;
        chipsElements = elementsFromFixture(fixture, 'b-chip');
        chipsComponents = component.list.toArray();
      });
  }));

  describe('Component', () => {
    it('should display 3 regular chips with default config', () => {
      expect(chipsElements.length).toEqual(3);
      expect(
        chipsComponents.filter(comp => comp.type === ChipType.tag).length
      ).toEqual(3);
      expect(listElement.dataset.align).toEqual(ChipListAlign.left);
      expect(
        chipsElements.filter(elem => elem.getAttribute('tabindex') === '-1')
          .length
      ).toEqual(3);
    });
  });

  describe('Config & Attributes', () => {
    it('should change Chip type', () => {
      component.config = {
        type: ChipType.info
      };
      fixture.detectChanges();
      expect(
        chipsComponents.filter(comp => comp.type === ChipType.info).length
      ).toEqual(3);
    });

    it('should set disabled attribute', () => {
      component.config = {
        disabled: true
      };
      fixture.detectChanges();
      expect(
        chipsComponents.filter(comp => comp.disabled === true).length
      ).toEqual(3);
    });

    it('should enable focusable', () => {
      component.config = {
        focusable: true
      };
      fixture.detectChanges();
      expect(
        chipsElements.filter(elem => elem.getAttribute('tabindex') === '0')
          .length
      ).toEqual(3);
    });

    it('should enable removable', () => {
      component.config = {
        removable: true
      };
      fixture.detectChanges();
      expect(
        chipsComponents.filter(comp => comp.removable === true).length
      ).toEqual(3);
      expect(
        chipsElements.filter(
          elem => elem.children[0].className === 'remove-button'
        ).length
      ).toEqual(3);
    });

    it('should set align attribute', () => {
      component.config = {
        align: ChipListAlign.right
      };
      fixture.detectChanges();
      expect(listElement.dataset.align).toEqual(ChipListAlign.right);
    });
  });

  describe('Chip clicks', () => {
    it('should emit clicked event with Chip data when Chip is clicked', () => {
      chipsElements[0].click();
      expect(component.clicked.emit).toHaveBeenCalledWith(chips[0]);
    });
  });

  describe('Removable chips', () => {
    it('should emit removed event when Chip remove button is clicked', () => {
      component.config = {
        removable: true
      };
      fixture.detectChanges();
      (chipsElements[0].children[0] as HTMLElement).click();
      expect(component.removed.emit).toHaveBeenCalled();
    });
  });

  describe('Selectabe chips', () => {
    it('should set Chip selected atrribute when on click', () => {
      component.config = {
        selectable: true
      };
      fixture.detectChanges();
      expect(chipsComponents[0].selected).toBeFalsy();
      chipsElements[0].click();
      fixture.detectChanges();
      expect(chipsComponents[0].selected).toEqual(true);
    });
    it('should emit selected event when Chip is selected', () => {
      component.config = {
        selectable: true
      };
      fixture.detectChanges();
      chipsElements[0].click();
      expect(component.selected.emit).toHaveBeenCalled();
    });
  });

  describe('Key events', () => {
    it('should emit Keypressed event', () => {
      chipsElements[0].dispatchEvent(new Event('keydown'));
      expect(component.keyPressed.emit).toHaveBeenCalled();
    });
  });

  describe('Alternative interface', () => {
    it('should accept a string[] as chips input and convert it to Chip[]', () => {
      component.ngOnChanges(simpleChange({ chips: ['A', 'B', 'C'] }));
      fixture.detectChanges();

      expect(component.chips).toEqual([
        { text: 'A' },
        { text: 'B' },
        { text: 'C' }
      ]);
    });
  });
});
