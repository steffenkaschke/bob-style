import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  object,
  select,
  boolean,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { HierarchyListModule } from './hierarchy-list.module';
import { HListMock, HListMockSimple } from './hierarchy-list.mock';
import { SelectType } from '../list.enum';
import { text } from '@storybook/addon-knobs';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-hierarchy-list
      [type]="type"
      [list]="options === 'simple' ? listSimple : listRandom"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [readonly]="readonly"
      (changed)="changed($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">

</b-hierarchy-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Hierarchy List'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Hierarchy List

  #### Module
  *HierarchyListModule*


`;

story.add(
  'Hierarchy List',
  () => ({
    template: storyTemplate,
    props: {
      options: select('options', ['simple', 'random'], 'simple', 'Options'),

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

      listRandom: object('listRandom', HListMock, 'Options'),
      listSimple: object('listSimple', HListMockSimple, 'Options'),

      // value
      // viewFilter

      changed: action('List change'),
      apply: action('List apply'),
      cancel: action('List cancel'),
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        HierarchyListModule,
      ],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
