import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
  DoCheck,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { GenericObject } from '../../types';

import { QuickFilterLayoutModule } from './quick-filter-layout.module';
import { QuickFilterLayoutComponent } from './quick-filter-layout.component';
import { QuickFilterConfig } from '../quick-filter/quick-filter.interface';
import { ButtonsModule } from '../../buttons/buttons.module';
import { InputModule } from '../../form-elements/input/input.module';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { SocialModule } from '../../form-elements/social/social.module';
import { DateRangePickerModule } from '../../form-elements/date-range-picker/date-range-picker.module';
import { TimePickerModule } from '../../form-elements/timepicker/timepicker.module';
// tslint:disable-next-line: max-line-length
import { SplitInputSingleSelectModule } from '../../form-elements/split-input-single-select/split-input-single-select.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  elementFromFixture,
  elementsFromFixture,
  simpleChange,
} from '../../services/utils/test-helpers';
import { cloneDeep } from 'lodash';

const QFconfig = [
  {
    key: 'input',
    value: 'Some text',
    label: 'Input label',
  },
  {
    key: 'singleSelect',
    label: 'SingleSelect label',
    options: [
      {
        groupName: 'singleSelect',
        options: [
          { value: 'ss-option-1', id: 'ss-option-1-id' },
          { value: 'ss-option-2', id: 'ss-option-2-id' },
          { value: 'ss-option-3', id: 'ss-option-3-id' },
        ],
      },
    ],
  },
  {
    key: 'multiSelect',
    label: 'MultiSelect label',
    options: [
      {
        groupName: 'multiSelect',
        options: [
          { value: 'ms-option-1', id: 'ms-option-1-id' },
          { value: 'ms-option-2', id: 'ms-option-2-id' },
          { value: 'ms-option-3', id: 'ms-option-3-id' },
        ],
      },
    ],
  },
  {
    key: 'social',
    type: 'facebook',
    label: 'Social label',
  },
  {
    key: 'dateRange',
    type: 'date',
    label: 'DateRange label',
  },
  {
    key: 'timePicker',
    label: 'TimePicker label',
  },
  {
    key: 'splitInpSel',
    label: 'SplitInpSel label',
  },
];

@Component({
  template: `
    <b-quick-filter-layout
      [quickFilters]="quickFilters"
      [showResetFilter]="showResetFilter"
      (filtersChange)="onFiltersChange($event)"
    >
      <b-text-button
        class="actButt"
        bar-prefix
        *ngIf="showLeftButt"
        text="Left"
        color="primary"
      >
      </b-text-button>

      <b-text-button
        class="actButt"
        bar-suffix
        *ngIf="showRightButt"
        text="Right"
        color="primary"
      >
      </b-text-button>

      <b-input *ngIf="showInput" [id]="'input'" class="formComp"></b-input>

      <b-single-select
        *ngIf="showSingleSelect"
        [id]="'singleSelect'"
        class="formComp"
      ></b-single-select>

      <b-multi-select
        *ngIf="showMultiSelect"
        [id]="'multiSelect'"
        class="formComp"
      >
      </b-multi-select>

      <b-social *ngIf="showSocial" [id]="'social'" class="formComp"></b-social>

      <b-timepicker
        *ngIf="showTimePicker"
        [id]="'timePicker'"
        class="formComp"
      ></b-timepicker>

      <b-date-range-picker
        *ngIf="showDateRange"
        [id]="'dateRange'"
        class="formComp"
      >
      </b-date-range-picker>

      <b-split-input-single-select
        *ngIf="showSplitInpSel"
        [id]="'splitInpSel'"
        class="formComp"
      >
      </b-split-input-single-select>
    </b-quick-filter-layout>
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  constructor() {}

  public quickFilters: QuickFilterConfig[] = QFconfig;

  public showResetFilter = true;

  public showLeftButt = true;
  public showRightButt = true;

  public showInput = true;
  public showTimePicker = true;
  public showSocial = false;

  public showSingleSelect = false;
  public showMultiSelect = false;
  public showDateRange = false;
  public showSplitInpSel = false;

  @Output() filtersChange: EventEmitter<GenericObject> = new EventEmitter<
    GenericObject
  >();

  public onFiltersChange($event) {}
}

fdescribe('QuickFilterLayoutComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let QFLcomponent: QuickFilterLayoutComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        QuickFilterLayoutModule,
        ButtonsModule,
        InputModule,
        MultiSelectModule,
        SingleSelectModule,
        SocialModule,
        DateRangePickerModule,
        TimePickerModule,
        SplitInputSingleSelectModule,
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        fixture.detectChanges();
        QFLcomponent = fixture.debugElement.query(
          By.css('b-quick-filter-layout')
        ).componentInstance;
      });
  }));

  describe('Initial render', () => {
    it('Should display 2 form elements', () => {
      fixture.detectChanges();
      expect(QFLcomponent.formComponents.length).toEqual(2);
      expect(elementsFromFixture(fixture, '.formComp').length).toEqual(2);
    });

    it('Should display 2 buttons', () => {
      fixture.detectChanges();
      expect(QFLcomponent.actionButtons.length).toEqual(2);
      expect(elementsFromFixture(fixture, '.actButt').length).toEqual(2);
    });

    it('Should bind label and value from QuickFilterConfig', () => {
      expect(
        elementFromFixture(fixture, 'b-timepicker .bfe-label').innerHTML
      ).toContain('TimePicker label');

      expect(
        elementFromFixture<HTMLInputElement>(fixture, 'b-input .bfe-input')
          .value
      ).toEqual('Some text');
    });

    it('Should subscribe to form elements output events', () => {
      expect(QFLcomponent['subscribtions'].length).toEqual(5);
    });

    it('Should initialize value object with 2 props', () => {
      expect(QFLcomponent.value).toEqual({
        input: 'Some text',
        timePicker: null,
      });
    });

    it('Should map components output emitters', () => {
      expect(QFLcomponent['formCompEmittersMap']).toEqual({
        input: 'changed',
        timePicker: 'changed',
      });
    });
  });

  describe('Dynamic [quickFilters]', () => {
    it('Should update label and value from QuickFilterConfig', () => {
      const newQFconfig = cloneDeep(QFconfig);
      newQFconfig[0].value = 'Some other text';
      newQFconfig[5].label = 'New TimePicker label';

      QFLcomponent.ngOnChanges(
        simpleChange({
          quickFilters: newQFconfig,
        })
      );

      fixture.detectChanges();

      expect(
        elementFromFixture(fixture, 'b-timepicker .bfe-label').innerHTML
      ).toContain('New TimePicker label');

      expect(
        elementFromFixture<HTMLInputElement>(fixture, 'b-input .bfe-input')
          .value
      ).toEqual('Some other text');
    });
  });

  describe('Dynamic ng-content form elements', () => {
    beforeEach(() => {
      testComponent.showTimePicker = false;
      testComponent.showSocial = true;
      fixture.detectChanges();
    });

    it('Should show social input and remove timepicker', () => {
      expect(elementFromFixture(fixture, 'b-timepicker')).toBeFalsy();
      expect(elementFromFixture(fixture, 'b-social')).toBeTruthy();
    });

    it('Should remove timepicker key from value and formCompEmittersMap objects', () => {
      fixture.detectChanges();

      expect(QFLcomponent.value).toEqual({
        input: 'Some text',
        social: '',
      });
      expect(QFLcomponent['formCompEmittersMap']).toEqual({
        input: 'changed',
        social: 'changed',
      });
    });
  });
});
