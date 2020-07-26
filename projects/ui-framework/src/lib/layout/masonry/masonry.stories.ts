import { storiesOf } from '@storybook/angular';
import { text, number, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MasonryModule } from './masonry.module';
import { masonryCardsMock } from './masonry.mock';
import { CardsModule } from '../../cards/cards.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<b-masonry [config]="{
      columns: columns,
      columnWidth: columnWidth,
      gap: gap
    }">

    <div *ngFor="let card of cards" style="padding: 16px; border: 1px solid grey;">
      <h3 style="margin-top:0;">{{card.title}}</h3>
      <p style="margin:0;">{{card.text}}</p>
    </div>

</b-masonry>`;

const templateForNotes = `<b-masonry [config]="config">
    <b-card *ngFor="let card of cards" [card]="card">
    </b-card>
</b-masonry>`;

const storyTemplate = `
<b-story-book-layout [title]="'Masonry'">

  ${template1}

</b-story-book-layout>
`;

const note = `
  ## Masonry Layout
  #### Module
  *MasonryModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---

  ~~~
  ${templateForNotes}
  ~~~
`;

story.add(
  'Masonry',
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
          MasonryModule,
          CardsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
