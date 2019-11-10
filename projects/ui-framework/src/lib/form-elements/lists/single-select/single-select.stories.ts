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
                 <b-text-button footer
                    [text]="'Click Me!'"
                    [color]="'primary'">
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
  ## Single Select 2

  #### Module
  *SingleSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  options | SelectGroupOption[] | model of selection group | none
  value | (string or number) | selected id | none
  selectChange | action | returns ListChange | none
  label | string | label text | none
  description | string | description text (above icon)
  placeholder | string | placeholder text | none
  disabled | boolean | is field disabled | none
  required | boolean | is field required | none
  hintMessage | text | hint text | none
  errorMessage | text | error text | none
  showSingleGroupHeader | boolean | displays single group with group header | false
  showNoneOption | boolean | displays the no-selection option | true

  ~~~
  ${template}
  ~~~
`;

const options = cloneDeep(optionsMock);
// options[0].options[1].value =
//   'some other very long text and some more words to have ellipsis and tooltip';

const toAdd = () => ({
  template: storyTemplate,
  props: {
    selectChange: action('Single select change'),
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
