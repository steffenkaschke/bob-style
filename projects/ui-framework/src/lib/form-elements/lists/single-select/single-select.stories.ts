import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectModule } from './single-select.module';
import { SelectGroupOption } from '../list.interface';
import { mockText } from '../../../mock.const';
import { optionsMock } from '../single-list/single-list.mock';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../../avatar/avatar/avatar.module';
import { cloneDeep } from 'lodash';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-select [label]="label"
                 [placeholder]="placeholder"
                 [description]="description"
                 [options]="options"
                 (selectChange)="selectChange($event)"
                 [disabled]="disabled"
                 [required]="required"
                 [errorMessage]="errorMessage"
                 [hintMessage]="hintMessage"
                 [showSingleGroupHeader]="showSingleGroupHeader">
    <b-text-button footerAction
      [text]="'Click Me!'">
    </b-text-button>
</b-single-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Select

  #### Module
  *SingleSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | &nbsp;
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [showNoneOption] | boolean | displays the no-selection option | true
  [listActions] | ListFooterActions / string | enable/disable footer action buttons\
   (clear, apply, reset). If you provide a string, \
   it will be used for button text, instead of default. | { clear:&nbsp;false, apply:&nbsp;false }
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange | &nbsp;
  &lt;elem footerAction&gt; | ng-content | element with attribute \`footerAction\` will be placed in the footer | &nbsp;
  [label] | string | label text | &nbsp;
  [description] | string | description text (above icon) | &nbsp;
  [placeholder] | string | placeholder text | &nbsp;
  [disabled] | boolean | is field disabled | &nbsp;
  [required] | boolean | is field required | &nbsp;
  [hintMessage] | text | hint text | &nbsp;
  [errorMessage] | text | error text | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const options = cloneDeep(optionsMock);
options[0].options[1].value =
  'some other very long text and some more words to have ellipsis and tooltip';

options[0].options[3].disabled = true;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    selectChange: action('Single select change'),
    label: text('label', 'label text', 'Props'),
    description: text('description', mockText(30), 'Props'),
    placeholder: text('placeholder', 'placeholder text', 'Props'),
    disabled: boolean('disabled', false, 'Props'),
    required: boolean('required', false, 'Props'),
    hintMessage: text(
      'hintMessage',
      'This field should contain something',
      'Props'
    ),
    errorMessage: text('errorMessage', '', 'Props'),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    options: object<SelectGroupOption>('options', options, 'Options'),
  },
  moduleMetadata: {
    imports: [
      SingleSelectModule,
      ButtonsModule,
      TypographyModule,
      BrowserAnimationsModule,
      StoryBookLayoutModule,
      AvatarModule,
    ],
    entryComponents: [AvatarComponent],
  },
});

story.add('Single select', toAdd, { notes: { markdown: note } });
story2.add('Single select', toAdd, { notes: { markdown: note } });
