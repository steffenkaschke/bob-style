import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import {
  withKnobs,
  select,
  number,
  text,
  boolean,
  object,
} from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SelectType } from '../list.enum';
import { HListMock, HListMockSimple } from '../tree-list/tree-list.mock';
import { TreeSelectModule } from './tree-select.module';
import { mockText } from '../../mock.const';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate = `
<b-tree-select
      [type]="type"
      [list]="options === 'simple' ? listSimple : listRandom"
      [value]="value"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage">

</b-tree-select>
`;

const template = `
<b-story-book-layout [title]="'Tree Select'">
  <div style="max-width: 350px;">
  ${componentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree Select

  #### Module
  *TreeSelectModule*

  ~~~
  ${componentTemplate}
  ~~~
`;

story.add(
  'Tree Select',
  () => {
    return {
      template,
      props: {
        type: select(
          'type',
          Object.values(SelectType),
          SelectType.multi,
          'Props'
        ),

        maxHeightItems: number('maxHeightItems', 8, {}, 'Props'),
        valueSeparatorChar: text('valueSeparatorChar', '/', 'Props'),
        startCollapsed: boolean('startCollapsed', true, 'Props'),
        showSingleGroupHeader: boolean('showSingleGroupHeader', false, 'Props'),

        label: text('label', 'label text', 'Props'),
        description: text('description', mockText(30), 'Props'),
        placeholder: text('placeholder', 'placeholder text', 'Props'),
        disabled: boolean('disabled', false, 'Props'),
        required: boolean('required', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        hintMessage: text(
          'hintMessage',
          'This field should contain something',
          'Props'
        ),
        errorMessage: text('errorMessage', '', 'Props'),

        // value
        // viewFilter

        options: select('options', ['simple', 'random'], 'random', 'Options'),
        listRandom: object('listRandom', HListMock, 'Options'),
        listSimple: object('listSimple', HListMockSimple, 'Options'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TreeSelectModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
