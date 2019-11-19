import {
  NgModule,
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  NgZone,
  AfterViewInit,
  DoCheck,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonsModule } from '../../../../ui-framework/src/lib/buttons/buttons.module';

import { FormsModule } from '@angular/forms';
import { GenericObject } from '../../../../ui-framework/src/lib/types';
import { QuickFilterConfig } from '../../../../ui-framework/src/lib/search/quick-filter/quick-filter.interface';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length
import { QuickFilterLayoutModule } from '../../../../ui-framework/src/lib/search/quick-filter-layout/quick-filter-layout.module';
import { InputModule } from '../../../../ui-framework/src/lib/form-elements/input/input.module';
// tslint:disable-next-line: max-line-length
import { MultiSelectModule } from '../../../../ui-framework/src/lib/form-elements/lists/multi-select/multi-select.module';
// tslint:disable-next-line: max-line-length
import { SingleSelectModule } from '../../../../ui-framework/src/lib/form-elements/lists/single-select/single-select.module';
import { SocialModule } from '../../../../ui-framework/src/lib/form-elements/social/social.module';
// tslint:disable-next-line: max-line-length
import { DateRangePickerModule } from '../../../../ui-framework/src/lib/form-elements/date-range-picker/date-range-picker.module';
import { TimePickerModule } from '../../../../ui-framework/src/lib/form-elements/timepicker/timepicker.module';
// tslint:disable-next-line: max-line-length
import { SplitInputSingleSelectModule } from '../../../../ui-framework/src/lib/form-elements/split-input-single-select/split-input-single-select.module';

const QFconfig = [
  {
    key: 'input',
    value: 'Some text',
    label: 'Input label',
    hintMessage: 'Input hint',
  },
  {
    key: 'singleSelect',
    label: 'SingleSelect label',
    hintMessage: 'SingleSelect hint',
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
    hintMessage: 'MultiSelect hint',
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
    hintMessage: 'Social hint',
  },
  {
    key: 'dateRange',
    type: 'date',
    label: 'DateRange label',
    hintMessage: 'DateRange hint',
  },
  {
    key: 'timePicker',
    label: 'TimePicker label',
    hintMessage: 'TimePicker hint',
  },
  {
    key: 'splitInpSel',
    label: 'SplitInpSel label',
    hintMessage: 'SplitInpSel hint',
    selectOptions: [
      {
        groupName: 'splitInpSel',
        options: [
          { value: 'sis-option-1', id: 'sis-option-1-id' },
          { value: 'sis-option-2', id: 'sis-option-2-id' },
          { value: 'sis-option-3', id: 'sis-option-3-id' },
        ],
      },
    ],
  },
];

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'filter-bar-test',
  template: `
    <div style="padding: 100px 50px">
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

        <b-social
          *ngIf="showSocial"
          [id]="'social'"
          class="formComp"
        ></b-social>

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

      <div style="margin-top:50px; display: flex; flex-wrap: wrap">
        <label
          ><input
            [(ngModel)]="showResetFilter"
            type="checkbox"
          />showResetFilter</label
        >

        <label
          ><input
            [(ngModel)]="showLeftButt"
            type="checkbox"
          />showLeftButt</label
        >

        <label
          ><input
            [(ngModel)]="showRightButt"
            type="checkbox"
          />showRightButt</label
        >
      </div>
      <div style="margin-top:15px; display: flex; flex-wrap: wrap">
        <label
          ><input [(ngModel)]="showInput" type="checkbox" />showInput</label
        >

        <label
          ><input
            [(ngModel)]="showTimePicker"
            type="checkbox"
          />showTimePicker</label
        >

        <label
          ><input [(ngModel)]="showSocial" type="checkbox" />showSocial</label
        >

        <label
          ><input
            [(ngModel)]="showSingleSelect"
            type="checkbox"
          />showSingleSelect</label
        >

        <label
          ><input
            [(ngModel)]="showMultiSelect"
            type="checkbox"
          />showMultiSelect</label
        >

        <label
          ><input
            [(ngModel)]="showDateRange"
            type="checkbox"
          />showDateRange</label
        >

        <label
          ><input
            [(ngModel)]="showSplitInpSel"
            type="checkbox"
          />showSplitInpSel</label
        >
      </div>
    </div>
  `,
  styles: [
    'label, span {display:block; margin: 3px 7px;}',
    '[type="checkbox"] {margin-right: 15px;}',
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarTestComponent implements AfterViewInit, DoCheck {
  constructor(public cd: ChangeDetectorRef) {}

  public quickFilters: QuickFilterConfig[] = QFconfig;

  public showResetFilter = false; // true;

  public showLeftButt = false; //true;
  public showRightButt = false; //true;

  public showInput = false; //true;
  public showTimePicker = false; //true;
  public showSocial = false;

  public showSingleSelect = false;
  public showMultiSelect = false;
  public showDateRange = false;
  public showSplitInpSel = false;

  @Output() filtersChange: EventEmitter<GenericObject> = new EventEmitter<
    GenericObject
  >();

  ngDoCheck() {}

  ngAfterViewInit() {}

  public onFiltersChange($event) {
    this.filtersChange.emit($event);
  }
}

@NgModule({
  declarations: [FilterBarTestComponent],
  exports: [FilterBarTestComponent],
  imports: [
    BrowserModule,
    ButtonsModule,
    FormsModule,
    CommonModule,
    NoopAnimationsModule,
    QuickFilterLayoutModule,
    InputModule,
    MultiSelectModule,
    SingleSelectModule,
    SocialModule,
    DateRangePickerModule,
    TimePickerModule,
    SplitInputSingleSelectModule,
  ],
  providers: [],
  entryComponents: [],
})
export class FilterBarTestModule {}
