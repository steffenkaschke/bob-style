import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarComponent, AvatarModule } from '../buttons-indicators/avatar';
import { mockColumns, mockData } from './table.mock';


const tableStories = storiesOf(ComponentGroupType.DataTable, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Data Table">
  <b-table
    [data]="data"
    [columns]="columns"
    [multiSelect]="multiSelect"
    (selected)="selected($event)"
    (sort)="sort($event)"
    (rowClicked)="rowClicked($event)"
    (columnFiltered)="columnFiltered($event)"
    (rowRightClicked)="rowRightClicked($event)">
  </b-table>
</b-story-book-layout>
`;

const note = `
  ## Auto complete Element

  #### Properties
  Name | Type | Description
  --- | --- | ---
  data | json | Table data
  columns | json | Table columns
  multiSelect | boolean | is multi select
  selected | id | input events emitter
  sort | id | input events emitter
  rowClicked | id | input events emitter
  rowRightClicked | id | input events emitter

  ~~~
  ${ template }
  ~~~
`;
tableStories.add(
  'Data Table',
  () => {
    return {
      template,
      props: {
        data: object('data', mockData),
        columns: object('columns', mockColumns),
        multiSelect: boolean('multiSelect', false),
        selected: action(),
        sort: action(),
        rowClicked: action(),
        rowRightClicked: action()
      },
      moduleMetadata: {
        entryComponents: [AvatarComponent],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TableModule,
          AvatarModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
