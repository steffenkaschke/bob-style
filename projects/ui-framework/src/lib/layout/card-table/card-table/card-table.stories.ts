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
import { ChipsModule } from '../../../buttons-indicators/chips/chips.module';

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
  ## Card Table

  #### Module
  *CardTableModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  table | CardTableData | object that contains metadata and rowdata of the table | none


  #### Table data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  meta | MetaData | array of objects, describing table metadata per column | none
  rows | RowData[] | 2 dimentional array (array of arrays) of objects, providing table cell data per row | none


  #### table.meta[0] - single column meta-data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  id | string / number | unique column id | none (optional)
  name | string | column title | none
  width | number | number representing percentage - to set column width (if not provided, column width will be set automatically) | none (optional)
  style | allowedStyleObj | object with text-related CSS properties, to be applied on the cell (color, font-weight etc) | none (optional)
  sortable | boolean | to enable sorting by column | false


  #### table.rows[0][0] - single cell data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | string / string[] / Component | 1) if string is provided, it is treated as text with automatic truncating after 2 lines; 2) if an array of strings is provided - each string in array is displayed as separate line, truncated if it doesnt fit the width; 3) a Component can be provided to be displayed in the cell | none


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
          ChipsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
