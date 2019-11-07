import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  text,
  boolean
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialModule } from './social.module';
import { SearchModule } from '../../search/search/search.module';
import { Social } from './social.enum';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-social [value]="value"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [hintMessage]="hintMessage"
          [warnMessage]="warnMessage"
          [errorMessage]="errorMessage"
          (socialInputChange)="socialInputChange($event)">
</b-social>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Social'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Social Element

  #### Module
  *SocialModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | Social | type of input field |
  [value] | string | field value |
  [placeholder] | string | placeholder text (inside input) |
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text |
  [warnMessage] | string | warning text |
  [errorMessage] | string | error text |
  (socialInputChange) |  EventEmitter&lt;InputEvent&gt; | input events emitter |

  ~~~
  ${template}
  ~~~
`;

inputStories.add(
  'Social',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Social, Social.facebook),
        value: text('value', ''),
        placeholder: text('placeholder', 'username'),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        socialInputChange: action('social')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SearchModule,
          StoryBookLayoutModule,
          SocialModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
