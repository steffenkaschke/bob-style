import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  select,
  text,
  object,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RadioButtonModule } from './radio-button.module';
import values from 'lodash/values';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { RadioDirection } from './radio-button.enum';

const direction = values(RadioDirection);
const radioStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-radio-button [options]="options"
                [value]="value"
                [label]="label"
                [direction]="direction"
                [disabled]="disabled"
                [required]="required"
                [hintMessage]="hintMessage"
                [warnMessage]="warnMessage"
                [errorMessage]="errorMessage"
                (radioChange)="radioChange($event)">
</b-radio-button>
`;

const stroyTemplate = `
<b-story-book-layout [title]="'Radio Buttons'">
  <div style="padding: 30px; display: flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## Radio Button Element
  #### Module
  *RadioButtonModule*

  #### Properties

  Name | Type | Description
  --- | --- | ---
  options | string[] / RadioConfig[] | list of possible values or array of RadioConfig ({id,value}) objects
  value | string / number | value representing one of the string[] options or id of one of the RadioConfig ({id,value}) objects
  direction | RadioDirection | column or row, default=row
  label | string | label text
  hintMessage | string | hint text
  warnMessage | string | warning text
  errorMessage | string | error text
  disabled | boolean | is field disabled
  required | boolean | is field required
  radioChange | Function | callback for radioChange event

  ~~~
  ${template}
  ~~~
`;

radioStories.add(
  'Radio Button',
  () => {
    return {
      template: stroyTemplate,
      props: {
        value: object('value', { id: 11 }),

        options: array('radioConfig', [
          { id: 11, label: 'Option one' },
          { id: 12, label: 'Option two' },
          { id: 13, label: 'Option three' }
        ]),
        direction: select('direction', direction, direction.row),

        label: text('label', 'Radio label'),
        required: boolean('required', false),
        disabled: boolean('disabled', false),

        hintMessage: text('hintMessage', 'Useful hint'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),

        radioChange: action('radioChange')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          RadioButtonModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
