import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const textareaStories = storiesOf(ComponentGroupType.FormElements, module).addDecorator(withKnobs);

const template = `
<b-textarea style="width: 400px;"
            [maxChars]="maxChars"
            [label]="label"
            [value]="value"
            [disabled]="disabled"
            [required]="required"
            [errorMessage]="errorMessage"
            [hintMessage]="hintMessage"
            (inputEvents)="inputEvents($event)">
</b-textarea>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Textarea'">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Textarea Element
  #### Module
  *TextareaModule* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  maxChars | number | maximum characters
  value | string/number/float | type of input field
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  inputEvents | InputEvents | input events emitter

  ~~~
  ${template}
  ~~~
`;
textareaStories.add(
  'Textarea',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action(),
        maxChars: number('maxChars', ''),
        value: text('value', ''),
        label: text('label', 'label text'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TextareaModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
