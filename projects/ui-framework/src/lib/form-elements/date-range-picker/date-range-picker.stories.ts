import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { DateRangePickerModule } from './date-range-picker.module';
import { thisYear, thisMonth } from '../../services/utils/functional-utils';

const datepickerStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);
const template = `
<b-date-range-picker [value]="value"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [label]="label"
              [startDateLabel]="startDateLabel"
              [endDateLabel]="endDateLabel"
              [placeholder]="placeholder"
              [hideLabelOnFocus]="hideLabelOnFocus"
              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"
              [disabled]="disabled"
              [required]="required"
              (dateChange)="dateChange($event)">
</b-date-range-picker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Date Range Picker'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Date Range Picker

  #### Module
  *DateRangePickerModule*

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] | DateRangePickerValue <br> ({from: Date / string (YYYY-MM-DD), <br>to: Date / string (YYYY-MM-DD)} | start and end dates | none
  [minDate] | Date / string (YYYY-MM-DD) | minimum date | none
  [maxDate] | Date / string (YYYY-MM-DD) | maximum date | none
  [label] | string | label text (above input) | none
  [startDateLabel] | string | first datepicker label | none
  [endDateLabel] | string | second datepicker label | none
  [placeholder] | string | placeholder text (inside input) | none
  [hideLabelOnFocus] | boolean | places label in placeholder position | false
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text | none
  [warnMessage] | string | warning text | none
  [errorMessage] | string | error text | none
  (dateChange) | EventEmitter | Emited on date change | none

  ~~~
  ${template}
  ~~~
`;

const mockValues = [
  '',
  {
    from: `${thisYear()}-${thisMonth()}-12`,
    to: `${thisYear()}-${thisMonth()}-21`
  }
];

datepickerStories.add(
  'Date Range Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: select('value', mockValues, ''),
        minDate: select('minDate', ['', `${thisYear()}-${thisMonth()}-7`], ''),
        maxDate: select('maxDate', ['', `${thisYear()}-${thisMonth()}-25`], ''),
        label: text('label', ''),
        startDateLabel: text('startDateLabel', 'Start date'),
        endDateLabel: text('endDateLabel', 'End date'),
        placeholder: text('placeholder', ''),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        dateChange: action('Date Changed')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DateRangePickerModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
