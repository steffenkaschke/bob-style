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
import { TabsModule } from './tabs.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Tab } from './tabs.interface';
import { TabType } from './tabs.enum';

const inputStories = storiesOf(
  ComponentGroupType.Navigation,
  module
).addDecorator(withKnobs);

const tabs: Tab[] = [
  {
    label: 'Add new hire'
  },
  {
    label: 'Employee changes'
  },
  {
    label: 'Leave'
  },
  {
    label: 'Termination'
  }
];
const template = `
<b-tabs [tabs]="tabs"
        [type]="type"
        [selectedIndex]="selectedIndex"
        (selectChange)="onSelectedTabChange($event)">
</b-tabs>`;

const storyTemplate = `
<b-story-book-layout [title]="'Tabs'">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Tabs Element
  #### Module
  *TabsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  tabs | Tabs[] | tabs metadata
  selectChange | event | tab event which contains the change index
  selectedIndex | number | the selected tab index 0-n

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Tabs',
  () => {
    return {
      template: storyTemplate,
      props: {
        tabs: object<Tab>('tabs', tabs),
        type: select('type', Object.values(TabType), TabType.primary),
        onSelectedTabChange: action(),
        selectedIndex: number('selectedIndex', 0, 0)
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TabsModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
