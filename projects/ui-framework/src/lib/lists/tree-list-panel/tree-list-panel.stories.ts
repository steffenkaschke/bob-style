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
import { TreeListPanelModule } from './tree-list-panel.module';
import { SelectType } from '../list.enum';
import { HListMock, HListMockSimple } from '../tree-list/tree-list.mock';
import { ButtonsModule } from '../../buttons/buttons.module';
import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { BTL_KEYMAP_SERVER } from '../tree-list/tree-list.const';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate = `
<b-tree-list-panel
      [type]="type"
      [list]="options === 'simple' ? listSimple : listRandom"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [readonly]="readonly"
      [disabled]="disabled">

    <b-square-button  [disabled]="disabled"
                      [type]="buttonType.secondary"
                      [icon]="icons.table">
    </b-square-button>

</b-tree-list-panel>
`;

const template = `
<b-story-book-layout [title]="'Tree List Panel'">
  <div style="max-width: 400px;">
  ${componentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree List Panel

  #### Module
  *TreeListPanelModule*

  ~~~
  ${componentTemplate}
  ~~~
`;

story.add(
  'Tree List Panel',
  () => {
    return {
      template,
      props: {
        icons: Icons,
        buttonType: ButtonType,
        serverKeyMap: BTL_KEYMAP_SERVER,
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
        readonly: boolean('readonly', false, 'Props'),
        disabled: boolean('disabled', false, 'Props'),

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
          TreeListPanelModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
