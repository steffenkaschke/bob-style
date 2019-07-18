import { storiesOf } from '@storybook/angular';
import { text, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TimePickerModule } from './timepicker.module';

import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-timepicker

        [value]="value"
        [label]="label"
        [placeholder]="placeholder"
        [hideLabelOnFocus]="hideLabelOnFocus"
        [disabled]="disabled"
        [required]="required"

        [hintMessage]="hintMessage"
        [warnMessage]="warnMessage"
        [errorMessage]="errorMessage"

        (inputEvents)="inputEvents($event)">
</b-timepicker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Timepicker'">
  <div style="flex:1; max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Input Element
  #### Module
  *InputModule* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  InputType | InputTypes | type of input field
  value | string/number | value of input field
  label | string | label text (above input)
  placeholder | string | placeholder text (inside input)
  hideLabelOnFocus | boolean | if true: there will be no label above input, label text (if present) will be used as placeholder
  maxChars | number | maximum length
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | string | hint text
  warnMessage | string | warning text
  errorMessage | string | error text
  enableBrowserAutoComplete | InputAutoCompleteOptions | shows browser autocomplete options
  inputEvents | InputEvents | input events emitter

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Timepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action('Input event'),

        value: text('value', ''),
        label: text('label', 'Input label'),
        placeholder: text('placeholder', 'Input placeholder'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),

        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TimePickerModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
