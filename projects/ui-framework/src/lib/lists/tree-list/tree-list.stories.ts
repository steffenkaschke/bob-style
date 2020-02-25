import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TreeListModule } from './tree-list.module';
import { TreeListStoriesCommonProps } from './tree-list.stories.common';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-tree-list
      [type]="type"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [list]="options === 'simple' ? listSimple : listRandom"
      [value]="options === 'simple' ? valueSimple : valueRandom"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [readonly]="readonly"
      [disabled]="disabled"
      (changed)="changed($event)"
      (apply)="apply($event)"
      (cancel)="cancel($event)">

</b-tree-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Tree List'">
  <div style="max-width: 500px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree List

  #### Module
  *TreeListModule*


`;

story.add(
  'Tree List',
  () => ({
    template: storyTemplate,
    props: {
      ...TreeListStoriesCommonProps(),
    },
    moduleMetadata: {
      imports: [BrowserAnimationsModule, StoryBookLayoutModule, TreeListModule],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
