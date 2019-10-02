import { DatepickerComponent } from './datepicker.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import {
  elementFromFixture,
  getPseudoContent,
  simpleChange,
  inputValue
} from '../../services/utils/test-helpers';
import { UtilsService } from '../../services/utils/utils.service';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';
import { DateTimeInputService } from './date-time-input.service';
import { MobileService } from '../../services/utils/mobile.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { IconsModule } from '../../icons/icons.module';
import { InputMessageModule } from '../input-message/input-message.module';
import { dateToString } from '../../services/utils/transformers';
import { isDate } from 'date-fns';

describe('DatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;
  let componentElem: HTMLElement;
  let labelElem: HTMLElement;
  let inputElem: HTMLInputElement;
  let iconElem: HTMLElement;
  let messageElem: HTMLElement;
  let picker: MatDatepicker<any>;

  let utilsServiceStub: jasmine.SpyObj<UtilsService>;
  let mobileServiceStub: jasmine.SpyObj<MobileService>;

  beforeEach(async(() => {
    utilsServiceStub = createSpyObj('UtilsService', ['getResizeEvent']);
    utilsServiceStub.getResizeEvent.and.returnValue(of());

    mobileServiceStub = createSpyObj('MobileService', ['getMediaEvent']);
    mobileServiceStub.getMediaEvent.and.returnValue(of());

    TestBed.configureTestingModule({
      imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        IconsModule,
        InputMessageModule
      ],
      declarations: [DatepickerComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceStub },
        { provide: MobileService, useValue: mobileServiceStub },
        DateTimeInputService,
        EventManagerPlugins[0]
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DatepickerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DatepickerComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        component.emitOnWrite = true;
        component.label = 'Label';
        component.hintMessage = 'Hint';
        component.required = true;

        fixture.detectChanges();

        labelElem = elementFromFixture(fixture, '.bfe-label');
        inputElem = elementFromFixture(
          fixture,
          '.bfe-input'
        ) as HTMLInputElement;

        messageElem = elementFromFixture(fixture, '[b-input-message]');

        spyOn(component.changed, 'emit');

        picker = component.pickers.toArray()[0];
      });
  }));

  describe('Basic inputs', () => {
    it('should display label', () => {
      expect(labelElem.innerText).toContain('Label');
      expect(getPseudoContent(labelElem, 'after')).toContain('*');
    });
    it('should display hint message', () => {
      expect(messageElem.innerText).toContain('Hint');
    });
  });

  describe('Input messages', () => {
    it('should display error message', () => {
      component.errorMessage = 'Error';
      fixture.detectChanges();

      expect(componentElem.classList).toContain('error');
      expect(messageElem.innerText).toContain('Error');
    });
  });

  describe('Icon', () => {
    it('should display calendar icon', () => {
      iconElem = elementFromFixture(fixture, '.open-picker .b-icon');
      expect(iconElem).toBeTruthy();
      expect(iconElem.classList).toContain('b-icon-calendar');
    });
  });

  describe('Min/Max date', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          minDate: '2019-09-10',
          maxDate: '2019-09-25'
        })
      );
      fixture.detectChanges();
    });

    it('should set min date for MatDatepicker', () => {
      expect(dateToString(picker._minDate)).toEqual('2019-09-10');
    });

    it('should set max date for MatDatepicker', () => {
      expect(dateToString(picker._maxDate)).toEqual('2019-09-25');
    });
  });

  describe('Value input', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '2019-09-15'
        })
      );
      fixture.detectChanges();
    });

    it('should convert string to Date for internal use', () => {
      expect(isDate(component.value)).toBeTruthy();
      expect(dateToString(component.value)).toEqual('2019-09-15');
    });

    it('should set date for MatDatepicker', () => {
      expect(isDate(picker._selected)).toBeTruthy();
      expect(dateToString(picker._selected)).toEqual('2019-09-15');
    });

    it('should emit changed event', () => {
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onWrite',
        value: '2019-09-15'
      });
    });
  });

  describe('Keyboard input', () => {
    beforeEach(() => {
      inputValue(inputElem, '24.12.2012');
      fixture.detectChanges();
    });

    it('should pass properly entered date to MatDatepicker', () => {
      expect(isDate(picker._selected)).toBeTruthy();
      expect(dateToString(picker._selected)).toEqual('2012-12-24');
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '2019-09-15'
        })
      );
      fixture.detectChanges();
      iconElem = elementFromFixture(fixture, '.clear-input .b-icon');
    });

    it('should display clear icon, when component has value', () => {
      expect(iconElem.classList).toContain('b-icon-circle-cancel');
    });

    it('should clear value when clear button is clicked', () => {
      expect(component.value).not.toBeNull();
      iconElem.click();
      expect(component.value).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        value: null,
        date: null
      });
    });
  });

  describe('Month picker', () => {
    beforeEach(() => {});

    it('should ', () => {});
  });
});
