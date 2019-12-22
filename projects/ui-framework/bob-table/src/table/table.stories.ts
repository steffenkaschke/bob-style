import { storiesOf } from '@storybook/angular';
import {
  number,
  object,
  select,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../src/lib/consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { TableModule } from './table.module';
import { AvatarModule } from '../../../src/lib/avatar/avatar/avatar.module';
import { mockColumnsDefs, mockRowData } from './table-mocks/table-story.mock';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelection, TableType } from './table/table.enum';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';

const story = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `
<b-table [type]="type"
         [rowData]="rowData"
         [columnDefs]="columnDefs"
         [maxHeight]="maxHeight"
         [rowSelection]="rowSelection"
         [removeColumnButtonEnabled]="removeColumnButtonEnabled"
         (rowClicked)="rowClicked($event)"
         (cellClicked)="cellClicked($event)"
         (selectionChanged)="selectionChanged($event)"
         (sortChanged)="sortChanged($event)"
         (columnsOrderChanged)="columnsOrderChanged($event)"
         (columnRemoved)="columnRemoved($event)">
</b-table>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Data Table'">
  <div style="max-width: calc(100% - 60px);">
    ${template}
  </div>

</b-story-book-layout>
`;

const type = values(TableType);
const rowSelection = values(RowSelection);

const note = `
  ## Auto complete Element

  #### Module
  *TableModule*
  from <u>'bob-style/bob-table'</u>

  \`\`\`
  import { TableModule, TableType, RowSelection, ColumnDef, RowClickedEvent, GridActions } from 'bob-style/bob-table';
  \`\`\`

  #### Properties
  Name | Type | Description | default value
  --- | --- | --- | ---
  [type] | TableType | table style theme | TableType.primary
  [rowData] | json | Table data | &nbsp;
  [columnDefs] | json | Columns definition | &nbsp;
  [rowSelection] | RowSelection | single multiple | null
  suppressColumnVirtualisation | boolean | disables virtual scroll on columns | true
  [maxHeight] | number | grid max height | 450
  [tableGridOptions] | GridOptions - Partial | extra options that are added on grid | {}
  [suppressDragLeaveHidesColumns] | boolean | disables 'dragging column out to remove it' behaviour | false
  [removeColumnButtonEnabled] | boolean | adds (x) button to column header | false
  (rowClicked) | EventEmitter<wbr>&lt;RowClickedEvent&gt; | Row clicked event | &nbsp;
  (gridInit) | EventEmitter<wbr>&lt;void&gt;  | Grid init event | &nbsp;
  (selectionChanged) | EventEmitter<wbr>&lt;any[]&gt; | All selected rows | &nbsp;
  (sortChanged) | EventEmitter<wbr>&lt;SortChangedEvent&gt; | Sort changed event | &nbsp;
  (columnsChanged) | EventEmitter<wbr>&lt;void&gt; | emits when columns change | &nbsp;
  (columnsOrderChanged) | EventEmitter<wbr>&lt;ColumnsOrderChangedEvent&gt; | emits when column order changes | &nbsp;
  (cellClicked) | EventEmitter<wbr>&lt;CellClickedEvent&gt; | emits on cell click | &nbsp;
  (columnRemoved) | EventEmitter<wbr>&lt;string&gt; | Emits Cell ID,\
   when remove coulumn button is clicked in column header. \
   <br>**Note** the column is not removed - consumer has to provide this functionality. | &nbsp;

  #### Methods
  Name | Type | Description
  --- | --- | --- | ---
  addRows | (rows: any[]): void | add rows
  updateRows | (rowsData: any[]): void  | update rows
  removeRows | (rows: any[]): void  | remove rows
  filterRows | (filterQuery: string): void  | search rows
  resetFilter | (): void | reset filter
  getDisplayedRowCount | (): number | get displayed rows number
  getRow | (rowIndex: string): RowNode | returns row by index
  deselectAll | (): void | deselects all

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Data Table',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', type, TableType.Primary, 'Props'),
        maxHeight: number('maxHeight', 450, {}, 'Props'),
        rowSelection: select(
          'rowSelection',
          rowSelection,
          RowSelection.Multiple,
          'Props'
        ),
        removeColumnButtonEnabled: boolean(
          'removeColumnButtonEnabled',
          false,
          'Props'
        ),
        columnDefs: object('columnDefs', mockColumnsDefs, 'Data'),
        rowData: object('rowData', mockRowData, 'Data'),
        rowClicked: action('Row clicked'),
        cellClicked: action('Cell clicked'),
        selectionChanged: action('Selection changed'),
        sortChanged: action('Sort changed'),
        columnsOrderChanged: action('Column order changed'),
        columnRemoved: action('Column remove button clicked'),
      },
      moduleMetadata: {
        entryComponents: [AvatarCellComponent, ActionsCellComponent],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TableModule,
          AgGridModule,
          AvatarModule,
          AgGridModule.withComponents([AvatarCellComponent]),
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
