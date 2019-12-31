import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { EditableListComponent } from './editable-list.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { EditableListService } from './editable-list.service';
import { SelectOption } from '../list.interface';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { simpleChange, inputValue } from '../../services/utils/test-helpers';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ListSortType } from './editable-list.enum';
import { cloneDeep } from 'lodash';

describe('EditableListComponent', () => {
  let fixture: ComponentFixture<EditableListComponent>;
  let component: EditableListComponent;

  const selectOptionsMock: SelectOption[] = [
    {
      id: 1,
      value: 'Martial arts',
      selected: false,
    },
    {
      id: 2,
      value: 'Climbing',
      selected: false,
    },
    {
      id: 3,
      value: 'Football',
      selected: true,
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditableListComponent],
      imports: [
        CommonModule,
        IconsModule,
        NgxSmoothDnDModule,
        InputMessageModule,
        ButtonsModule,
      ],
      providers: [EditableListService, EventManagerPlugins[0]],
    })
      .overrideComponent(EditableListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EditableListComponent);
        component = fixture.componentInstance;
        component.ngOnChanges(
          simpleChange({
            list: cloneDeep(selectOptionsMock),
          })
        );

        DOMhelpers.prototype.injectStyles(`
          .html-reporter .result-message {
            white-space: pre-line !important;
            margin-bottom: 14px;
            line-height: 2;
            max-width: 700px;
          }
          .html-reporter .stack-trace {
            white-space: pre-line !important;
          }
        `);
      });
  }));

  describe('maxChars', () => {
    it('should accept 10 chars if max chars is 10', () => {
      component.maxChars = 10;
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      expect(input.attributes.maxLength).toEqual('10');
    });
  });

  describe('Adding/Deleting items', () => {
    it('should have all items in the list', () => {
      const list = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list.length).toEqual(3);
      expect(component.listState.list).toEqual(selectOptionsMock);
    });

    it('should delete item from the list', fakeAsync(() => {
      const del = fixture.debugElement.query(
        By.css('.bel-trash-button button')
      );
      del.nativeElement.click();
      fixture.detectChanges();
      const remove = fixture.debugElement.query(
        By.css('.bel-remove-button button')
      );
      remove.nativeElement.click();
      tick(300);
      fixture.detectChanges();
      const list3 = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list3.length).toEqual(2);
    }));

    it('should emit the right event when item was deleted', fakeAsync(() => {
      spyOn(component.changed, 'emit');
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      del[2].nativeElement.click();
      fixture.detectChanges();
      const remove = fixture.debugElement.queryAll(
        By.css('.bel-remove-button button')
      );
      remove[2].nativeElement.click();
      tick(300);
      fixture.detectChanges();
      const expectedParam = {
        delete: ['Football'],
        create: [],
        order: ['Martial arts', 'Climbing'],
        sortType: 'UserDefined',
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    }));

    it('should add item to the list', () => {
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      inputValue(input.nativeElement, 'Drawing');
      fixture.detectChanges();
      const done = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      done.nativeElement.click();
      fixture.detectChanges();
      const list3 = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list3.length).toEqual(4);
    });

    it('should emit the right event when item was added', done => {
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      const doneButton = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      component.changed.subscribe(data => {
        expect(data.create[0]).toEqual('abc');
        expect(data.order[0]).toEqual('abc');
        done();
      });
      inputValue(input.nativeElement, 'abc');
      fixture.detectChanges();
      doneButton.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show an error if item is in the list already', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      inputValue(
        input.nativeElement,
        component.list[0].value.toUpperCase(),
        false,
        false
      );
      fixture.detectChanges();
      const done = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      done.nativeElement.click();
      fixture.detectChanges();
      tick(100);
      const error = fixture.debugElement.query(
        By.css('[b-input-message] .error')
      );
      expect(error.nativeElement.innerText).toContain(
        `"${selectOptionsMock[0].value}" already exists`
      );
    }));
  });

  describe('Sorting', () => {
    it('should sort ascending when pressing Asc button ', () => {
      spyOn(component.changed, 'emit');
      const sort = fixture.debugElement.query(
        By.css('.bel-sort-button button')
      );
      sort.nativeElement.click();
      fixture.detectChanges();
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Climbing', 'Football', 'Martial arts'],
        sortType: 'Asc',
        list: [
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort descending when pressing Desc button', () => {
      spyOn(component.changed, 'emit');
      const sort = fixture.debugElement.query(
        By.css('.bel-sort-button button')
      );
      sort.nativeElement.click();
      sort.nativeElement.click();
      fixture.detectChanges();
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Martial arts', 'Football', 'Climbing'],
        sortType: 'Desc',
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort ascending with sortType input ', () => {
      spyOn(component.changed, 'emit');
      component.ngOnChanges(
        simpleChange({
          sortType: ListSortType.Asc,
        })
      );
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Climbing', 'Football', 'Martial arts'],
        sortType: 'Asc',
        list: [
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort descending with sortType input', () => {
      spyOn(component.changed, 'emit');
      component.ngOnChanges(
        simpleChange({
          sortType: ListSortType.Desc,
        })
      );

      const expectedParam = {
        delete: [],
        create: [],
        order: ['Martial arts', 'Football', 'Climbing'],
        sortType: 'Desc',
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });
  });
});