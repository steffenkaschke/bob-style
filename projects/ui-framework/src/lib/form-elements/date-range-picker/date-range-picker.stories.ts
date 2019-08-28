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

const datepickerStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);
const template = `
<b-date-range-picker [value]="value"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [label]="label"
              [placeholder]="placeholder"
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
  [value] | Date / string (YYYY-MM-DD) | date | none
  [minDate] | Date / string (YYYY-MM-DD) | minimum date | none
  [maxDate] | Date / string (YYYY-MM-DD) | maximum date | none
  [label] | string | label text (above input) | none
  [placeholder] | string | placeholder text (inside input) | none
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text | none
  [warnMessage] | string | warning text | none
  [errorMessage] | string | error text | none
  (dateChange) | EventEmitter | Date change callback | none

  ~~~
  ${template}
  ~~~
`;

datepickerStories.add(
  'Date Range Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: select('value', ['', '2019-12-31', '2015-05-25'], ''),
        minDate: select('minDate', ['', '2019-08-10'], ''),
        maxDate: select('maxDate', ['', '2019-08-25'], ''),
        label: text('label', 'Date picker'),
        placeholder: text('placeholder', ''),
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
