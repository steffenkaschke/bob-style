import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  object,
  text,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { MultiSelectModule } from './multi-select.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../../avatar/avatar/avatar.module';
import { mockText } from '../../../mock.const';
import { cloneDeep } from 'lodash';
import { optionsMock } from '../multi-list/multi-list.mock';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-select [label]="label"
                [placeholder]="placeholder"
                [description]="description"
                [options]="options"
                (selectChange)="selectChange($event)"
                (selectModified)="selectModified($event)"
                (selectCancelled)="selectCancelled($event)"
                [disabled]="disabled"
                [required]="required"
                [errorMessage]="errorMessage"
                [hintMessage]="hintMessage">
    <b-text-button footerAction
      [text]="'Action!'"
      [color]="'primary'">
    </b-text-button>
</b-multi-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi select'">
  <div style="max-width: 350px;">
    ${template}
  </div>

</b-story-book-layout>
`;

const note = `
  ## Multi Select

  #### Module
  *MultiSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | &nbsp;
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [listActions] | ListFooterActions | enable/disable footer action buttons (clear, apply) | { clear:&nbsp;true, apply:&nbsp;true }
  (selectChange) | EventEmitter&lt;ListChange&gt; | emits ListChange | &nbsp;
  (selectModified) | EventEmitter&lt;ListChange&gt; | emits ListChange | &nbsp;
  (selectCancelled) | EventEmitter&lt;ListChange&gt; | emits ListChange | &nbsp;
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

const toAdd = () => ({
  template: storyTemplate,
  props: {
    selectChange: action('Multi select change'),
    selectModified: action('Multi select modified'),
    selectCancelled: action('Multi select cancelled'),
    label: text('label', 'label text'),
    description: text('description', mockText(30)),
    placeholder: text('placeholder', 'placeholder text'),
    disabled: boolean('disabled', false),
    required: boolean('required', false),
    hintMessage: text('hintMessage', 'This field should contain something'),
    errorMessage: text('errorMessage', ''),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true),
    options: object<SelectGroupOption>('options', options),
  },
  moduleMetadata: {
    imports: [
      MultiSelectModule,
      ButtonsModule,
      TypographyModule,
      BrowserAnimationsModule,
      StoryBookLayoutModule,
      AvatarModule,
    ],
    entryComponents: [AvatarComponent],
  },
});

story.add('Multi select', toAdd, { notes: { markdown: note } });
story2.add('Multi select', toAdd, { notes: { markdown: note } });
