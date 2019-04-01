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
import { CardTableMockMetaData, CardTableMockData } from '../cardTableMockData';
import { ChipsModule } from '../../../buttons-indicators/chips/chips.module';
import { ChipComponent } from '../../../buttons-indicators/chips/chip/chip.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-card-table [meta]="CardTableMetaData" [table]="CardTableData">
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
  Name | Type | Description
  --- | --- | ---
  meta | CardTableMetaData | array of objects, describing table meta-data per column
  table | CardTableData | 2-dimentional array (array of arrays) of objects, providing table cell data per row
  minCellWidth | number | number representing minimal cell width in percents | 5


  #### \`meta[0]\`: CardTableCellMeta - single column meta-data object properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  id | string / number | unique column id | none (optional)
  name | string | column title | none
  width | number | number representing percentage - to set column width (if not provided, column width will be set automatically) | none (optional)
  align | string ('left' or undefined / 'right') | text alignment in column | undefined (optional)
  textStyle | cardTableAllowedTextStyleObj | object with text-related CSS properties (camelCase), to be applied on the cell (color, fontWeight, fontSize) | none (optional)
  sortable | boolean | to enable sorting by column | false


  #### \`table[0][0]\`: CardTableCellData - single cell data object properties
  Name | Type | Description
  --- | --- | ---
  data | string | if string is provided, it is treated as text with automatic truncating after 2 lines
   - | string[] | if an array of strings is provided - each string is displayed as separate line, truncated if it doesnt fit the width
   - | CardTableCellComponent | object, describing a Component that can be provided to be displayed in the cell

  #### \`table[0][0].component\`: CardTableCellComponent - properties of object describing Component passed to cell
  Name | Type | Description | Default value
    --- | --- | --- | ---
  component | Component | component reference | none
  attributes | object | object with component inputs | none (optional)
  content | string | text to be passed as ng-content of the component | none (optional)

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
        CardTableMetaData: object('meta', CardTableMockMetaData),
        CardTableData: object('table', CardTableMockData)
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardTableModule,
          ChipsModule
        ],
        entryComponents: [ChipComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
