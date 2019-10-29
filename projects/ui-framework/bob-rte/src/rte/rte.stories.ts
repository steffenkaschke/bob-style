// tslint:disable

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { values } from 'lodash';
import { BlotType, RTEType } from './rte.enum';
import { mentionsOptions, placeholderMock } from './rte.mocks';
import { ComponentGroupType } from '../../../src/lib/consts';
import { dedupeArray } from '../../../src/lib/services/utils/functional-utils';
import { SelectGroupOption } from '../../../src/lib/form-elements/lists/list.interface';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { RichTextEditorModule } from './rte.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const disableControlsDef = [];
const controlsDef = dedupeArray(Object.values(BlotType)).filter(
  cntrl => !disableControlsDef.includes(cntrl)
);

const value = `<div>
  <span style="color: red;">Hello</span> http://Google.com!
  Some <em>funky</em> <strong>bold</strong> text
  of <span style="font-size: 18px;">large</span> size.
</div>
<div><br></div>
<p><strong><em><span style="font-size: 18px;">Hooray!</span></em></strong> {{basic/firstName}} is {{work/title}} of the month!</p>
<p>More details at: https://longlink.com/gohere/thenthere/onemore/page#hash?query=bigBen</p>
<div><br></div>
Here's an important list of things to remember:
<ul>
  <li>don't trust the <a href="https://www.youtube.com/watch?v=h3SD_oBOx7g" target="_blank" class="brte-mention">@Bitch</a> in apartment 23</li>
  <li>don't eat the <u>yellow</u> snow</li>
  <li>танцуй пока молодой</li>
  <li>אמור לא לסמים</li>
  <li style="direction: rtl; text-align: right;">beware the <a class="brte-mention" href="https://youtu.be/hOHvMqAgcmc?t=11">@Right Hook</a></li>
</ul>
`;

const template = `
  <b-rte
      [type]="type"
      [label]="label"
      [placeholder]="placeholder"
      [value]="value"
      [controls]="controls"
      [disableControls]="disableControls"
      [mentionsList]="mentionsOptions"
      [placeholderList]="placeholderList"
      [minChars]="minChars"
      [maxChars]="maxChars"
      [minHeight]="minHeight"
      [maxHeight]="maxHeight"
      [disabled]="disabled"
      [required]="required"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
      [errorMessage]="errorMessage"
      (changed)="change($event)"
      (focused)="focus($event)"
      (blurred)="blur($event)">
  </b-rte>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Rich text editor'" style="background-color: rgb(247,247,247);">
  <div>
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Module
  *RichTextEditorModule*
  from <u>'bob-rte'</u>

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [type] | RTEType | primary (white bg, border) or secondary (transparent bg, no borders) | primary
  [label] | string | label text (above editor) | none (optional)
  [placeholder] | string | placeholder text (inside editor. if only label is present, it will be treated as placeholder) | none (optional)
  [value] | string | html content to be placed inside editor | none (optional)
  [controls] | BlotType[] | array of toolbar controls (check BlotType enum for all possible controls). Defaults to all controls. Pass empty array to disable all controls | all
  [minChars] | number | minimum (plain) text length | 0
  [maxChars] | number | maximum (plain) text length | none (optional)
  [minHeight] | number | minimum height of editor (including toolbar). Set to **0** to disable min-height | 185 (optional)
  [maxHeight] | number | maximum height of editor (including toolbar). Set to **0** to disable max-height | 350 (optional)
  [disabled] | boolean | disables editor | false (optional)
  [required] | boolean | adds * to placeholder | false (optional)
  [hintMessage] | string | adds a hint message below editor | none (optional)
  [warnMessage] | string | adds a warning message below editor | none (optional)
  [errorMessage] | string | adds 'invalid' style, hides hint/warn message and displays error message below editor | none (optional)
  (changed) | EventEmitter&lt;string&gt; | emits in text change |
  (focused) | EventEmitter&lt;string&gt; | emits latest value on editor focus |
  (blurred) | EventEmitter&lt;string&gt; | emits latest value on editor blut |
  /content/ | any | pass content to transclude any custom controls/etc to toolbar |
`;

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(RTEType), RTEType.primary),
        placeholder: text('placeholder', 'Compose an epic...'),
        label: text('label', 'Edit rich textor'),
        value: text('value', value),
        minChars: number('minChars', 20),
        maxChars: number('maxChars', 500),
        minHeight: number('minHeight', 185),
        maxHeight: number('maxHeight'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        change: action('Value changed'),
        focus: action('Editor focused'),
        blur: action('Editor blurred'),
        controls: array('controls', controlsDef, '\n'),
        disableControls: array('disableControls', disableControlsDef, '\n'),
        placeholderList: object<SelectGroupOption>('options', placeholderMock),
        mentionsOptions: object('mentionsOptions', mentionsOptions)
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
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
