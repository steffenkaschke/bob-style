import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
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
                [direction]="direction"
                [disabled]="disabled"
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
  disabled | boolean | is field disabled
  direction | RadioDirection | column or row, default=row
  options | string[] | list of possible values
  value | string | value
  radioChange | action | callback with the selected id

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
        value: text('value', '11'),
        // options: array(
        //   'options',
        //   ['Option one', 'Option two', 'Option three'],
        //   '\n'
        // ),
        options: array('radioConfig', [
          { id: 11, label: 'Option one' },
          { id: 12, label: 'Option two' },
          { id: 13, label: 'Option three' }
        ]),
        direction: select('direction', direction, direction.row),
        disabled: boolean('disabled', false),
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
