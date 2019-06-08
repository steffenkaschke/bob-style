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
          [errorMessage]="errorMessage"
          [label]="label"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [hintMessage]="hintMessage"
          (socialInputChange)="socialInputChange($event)">
</b-social>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Social'">
  <div style="max-width: 400px; margin: 30px auto;">
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
  value | string | type of input field | none
  label | string | label text | none
  socialInputChange | action | socialInputChange output string | none

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
        errorMessage: text('errorMessage', ''),
        label: text('label', ''),
        placeholder: text('placeholder', 'Your name'),
        socialInputChange: action('social'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', '')
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
