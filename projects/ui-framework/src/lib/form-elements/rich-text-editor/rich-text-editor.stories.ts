import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { RichTextEditorModule } from './rich-text-editor.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-rich-text-editor
            [label]="label"
            [disabled]="disabled"
            [required]="required"
            [errorMessage]="errorMessage"
            [hintMessage]="hintMessage">
</b-rich-text-editor>
`;

const storyTemplate = `
<b-story-book-layout style="width: 90%; margin: 20px auto;" title="Rich text editor">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Module
  *RichTextEditorModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  rteHtml | string | html content to be placed inside editor

  ~~~
  ${template}
  ~~~
`;

const rteHtml = `
  <div>Hello World!</div>
  <div>Some initial <strong>bold</strong> text</div>
`;

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        rteHtml: text('rteHtml', rteHtml),
        label: text('label', 'Compose an epic..'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          RichTextEditorModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
