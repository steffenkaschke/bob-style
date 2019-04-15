import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  array
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { TypographyModule } from '../../typography/typography.module';
import { RichTextEditorModule } from './rich-text-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RTEType, RTEControls } from './rich-text-editor.enum';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const value = `
  <div>Hello World!</div>
  <div>Some initial <strong>bold</strong> text</div>
`;

const template = `
  <b-rich-text-editor
      [type]="type"
      [controls]="controls"
      [value]="value"
      [label]="label"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [hintMessage]="hintMessage"
      (changed)="change($event)"
      (focused)="focus($event)"
      (blurred)="blur($event)"
      >
    Some custom toolbar thing
  </b-rich-text-editor>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Rich text editor'">
  <div style="padding: 30px; background-color: rgb(0,0,0,0.1); height: 100%;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Module
  *RichTextEditorModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  value | string | html content to be placed inside editor

  ~~~
  ${template}
  ~~~
`;

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(RTEType), RTEType.primary),
        controls: array('controls', values(RTEControls), '\n'),
        value: text('value', value),
        label: text('label', 'Compose an epic...'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', ''),
        blur: action('Editor blurred'),
        focus: action('Editor focused'),
        change: action('Something has changed')
      },
      moduleMetadata: {
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          RichTextEditorModule
        ]
      }
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      escapeHTML: false
    }
  }
);
