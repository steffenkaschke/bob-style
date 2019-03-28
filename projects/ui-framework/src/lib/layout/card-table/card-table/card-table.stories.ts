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
import { ComponentGroupType } from '../../../consts';

import { CardTableModule } from '../card-table.module';
import { cardTableMockData } from '../cardTableMockData';
import { ChipComponent } from '../../../buttons-indicators/chips/chip/chip.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-card-table [table]="tableData">
</b-card-table>
`;

const storyTemplate = `
<b-story-book-layout title="Card Table">
  <div style="padding: 50px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Card

  #### Module
  *CardsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  menu | MenuItem[] | array of menu items | none (optional)
  text | string | main text | ''

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Card Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        tableData: object('tableData', cardTableMockData)
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardTableModule,
          ChipComponent
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
