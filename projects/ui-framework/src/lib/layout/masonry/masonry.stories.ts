import { storiesOf } from '@storybook/angular';
import { text, number, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MasonryLayoutModule } from './masonry.module';
import { masonryCardsMock } from './masonry.mock';
import { CardsModule } from '../../cards/cards.module';
import { MasonryTestModule } from './masonry-test.component';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<b-masonry-layout [config]="{
      columns: columns,
      columnWidth: columnWidth,
      gap: gap
    }">

    <b-masonry-test-card *ngFor="let card of cards" [card]="card">
    </b-masonry-test-card>

</b-masonry-layout>`;

const templateForNotes = `<b-masonry-layout [config]="config">
    <b-card *ngFor="let card of cards" [card]="card">
    </b-card>
</b-masonry-layout>`;

const storyTemplate = `
<b-story-book-layout [title]="'Masonry Layout'">

  ${template1}

</b-story-book-layout>
`;

const note = `
  ## Masonry Layout
  #### Module
  *MasonryLayoutModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [config] | MasonryConfig | defaults to 3 columns with 16px gap


  #### interface: MasonryConfig
  Name | Type | Description | Default value
  --- | --- | --- | ---
  columns | number | fixed number of equal-width colums in rows | 3
  columnWidth | number | min-width of column (number of columns in row will be automatic)<br>\
    Note: If columns prop is provided, columnWidth is ignored. | &nbsp;
  gap | number | spacing between cells | 16


`;

story.add(
  'Masonry Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        cards: masonryCardsMock,
        columns: number('columns', undefined),
        columnWidth: number('columnWidth', 250),
        gap: number('gap', 16),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          MasonryLayoutModule,
          CardsModule,
          MasonryTestModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
