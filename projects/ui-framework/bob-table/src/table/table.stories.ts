import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  object,
  select,
  withKnobs,
  text,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';
import { AgGridModule } from 'ag-grid-angular';
import { AvatarModule, ComponentGroupType, SearchModule } from 'bob-style';
import { values } from 'lodash';
import { Icons } from '../../../src/lib/icons/icons.enum';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
import {
  mockRowData,
  treeColumnDefsMock,
  treeRowDataMock,
  mockColumnsDefsExtended,
} from './table-mocks/table-story.mock';
import { TableModule } from './table.module';
import {
  TreeConfig,
  TreeCellRendererComponent,
} from './table/extensions/tree.config';
import { TableComponent } from './table/table.component';
import { RowSelection, TableType } from './table/table.enum';
import { ColumnDef } from './table/table.interface';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'b-tree-cell-avatar',
  template: '<b-avatar [imageSource]="props.imageSource"></b-avatar>',
})
export class TreeCellAvatarComponent implements TreeCellRendererComponent {
  props;
  constructor() {}
  init(props) {
    this.props = props;
  }
}

const story = storiesOf(ComponentGroupType.Tables, module).addDecorator(
  withKnobs
);

const template = `<b-table #table
    [type]="type"
    [rowData]="rowData | async"
    [columnDefs]="columnDefs | async"
    [tableGridOptions]="tableGridOptions"
    [maxHeight]="maxHeight"
    [rowSelection]="rowSelection"
    [removeColumnButtonEnabled]="removeColumnButtonEnabled"
    [shouldAutoSizeColumns]="shouldAutoSizeColumns"
    [styleConfig]="{
        disableRowHoverBgColor: disableRowHoverBgColor,
        showColumnBorders: showColumnBorders,
        showActionsOnHover: showActionsOnHover
    }"
    [enablePager]="enablePager"
    [emptyStateConfig]="emptyStateConfig"
    [enableRowDrag]="enableRowDrag"
    (rowClicked)="rowClicked($event)"
    (cellClicked)="cellClicked($event)"
    (selectionChanged)="selectionChanged($event); onSelectionChanged($event)"
    (sortChanged)="sortChanged($event)"
    (pagerPageSizeChange)="pagerPageSizeChange($event)"
    (columnsOrderChanged)="columnsOrderChanged($event)"
    (columnRemoved)="columnRemoved($event)">
</b-table>`;
const treeTemplate = `<b-table
    [type]="type"
    [treeConfig]="treeConfig"
    [rowData]="rowData | async"
    [columnDefs]="columnDefs | async"
    [isCollapsable]="isCollapsable"
    [maxHeight]="maxHeight"
    [rowSelection]="rowSelection"
    [removeColumnButtonEnabled]="removeColumnButtonEnabled"
    [shouldAutoSizeColumns]="shouldAutoSizeColumns"
    [styleConfig]="{
        disableRowHoverBgColor: disableRowHoverBgColor,
        showColumnBorders: showColumnBorders
    }"
    [enablePager]="enablePager"
    (rowClicked)="rowClicked($event)"
    (cellClicked)="cellClicked($event)"
    (selectionChanged)="selectionChanged($event)"
    (sortChanged)="sortChanged($event)"
    (columnsOrderChanged)="columnsOrderChanged($event)"
    (columnRemoved)="columnRemoved($event)">
  </b-table>`;

const storyTemplate = `
<b-story-book-layout [title]="'Data Table'">
  <div style="max-width: calc(100% - 60px); text-align: left">
<b-search style="display: block; width: 250px; margin-bottom: 8px;" (searchChange)="onSearchChange($event, table)"></b-search>
<div style="margin-bottom: 16px;">total selected: {{totalSelected}}</div>
    ${template}
  </div>

</b-story-book-layout>
`;

const treeStoryTemplate = `
<b-story-book-layout [title]="'Data Table'">
  <div style="max-width: calc(100% - 60px);">
    ${treeTemplate}
  </div>

</b-story-book-layout>
`;

const type = values(TableType);
const rowSelection = values(RowSelection);

const note = `
  ## Data Table

  #### Module
  *TableModule*
  from <u>'bob-style/bob-table'</u>

  \`\`\`
  import { TableModule, TableType, RowSelection, ColumnDef, RowClickedEvent, GridActions } from 'bob-style/bob-table';
  \`\`\`

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default value
  --- | --- | --- | ---
  [type] | TableType | table style theme | TableType.primary
  [rowData] | json | Table data | &nbsp;
  [treeConfig] | TreeConfig | the tree configuration of the table | &nbsp;
  [columnDefs] | json | Columns definition | &nbsp;
  [rowSelection] | RowSelection | single multiple | null
  suppressColumnVirtualisation | boolean | disables virtual scroll on columns | true
  suppressRowVirtualisation | boolean | disables virtual scroll on rows | false
  [maxHeight] | number | grid max height | 450
  [tableGridOptions] | GridOptions - Partial | extra options that are added on grid | {}
  [suppressDragLeaveHidesColumns] | boolean | disables 'dragging column out to remove it' behaviour | false
  [removeColumnButtonEnabled] | boolean | adds (x) button to column header | false
  [shouldAutoSizeColumns] | boolean | enable auto size | true
  [styleConfig] | TableStyleConfig | style config (disableRowHoverBgColor, showColumnBorders) | {}
  [enablePager] | boolean | enable pagination | false
  [enableRowDrag] | boolean | enable row dragging | false
  [pagerConfig] | PagerConfig | config for pagination (sliceStep, sliceMax, sliceSize)
  [emptyStateConfig] | EmptyStateConfig | config for the no-row-data state
  (pagerPageSizeChange) | EventEmitter<wbr>&lt;number&gt; | emits when page size changes | &nbsp;
  (rowClicked) | EventEmitter<wbr>&lt;RowClickedEvent&gt; | Row clicked event | &nbsp;
  (gridInit) | EventEmitter<wbr>&lt;void&gt;  | Grid init event | &nbsp;
  (selectionChanged) | EventEmitter<wbr>&lt;any[]&gt; | All selected rows | &nbsp;
  (sortChanged) | EventEmitter<wbr>&lt;SortChangedEvent&gt; | Sort changed event | &nbsp;
  (columnsChanged) | EventEmitter<wbr>&lt;ColumnsChangedEvent&gt; | emits when columns change | &nbsp;
  (columnsOrderChanged) | EventEmitter<wbr>&lt;ColumnsOrderChangedEvent&gt; | emits when column order changes | &nbsp;
  (cellClicked) | EventEmitter<wbr>&lt;CellClickedEvent&gt; | emits on cell click | &nbsp;
  (columnRemoved) | EventEmitter<wbr>&lt;string&gt; | Emits Cell ID,\
   when remove coulumn button is clicked in column header. \
   <br>**Note** the column is not removed - consumer has to provide this functionality. | &nbsp;
  (rowDragEnd) | EventEmitter<wbr>&lt;BRowDragEvent&gt; | emits on row drag end | &nbsp;

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
`;

const treeNotes = `
  ## Tree Table

  #### Module
  *TableModule*
  from <u>'bob-style/bob-table'</u>

  \`\`\`
  import { TreeConfig } from 'bob-style/bob-table';
  \`\`\`

  #### Properties
  Name | Type | Description | default value
  --- | --- | --- | ---
  [treeConfig] | TreeConfig | the tree configuration of the table | &nbsp;

  ~~~
  <b-table
    [treeConfig]="treeConfig"
  ></b-table>
  ~~~
`;

export interface TableStory {
  title: string;
  HTMLTemplate: string;
  tableData: any;
  tableCols: ColumnDef[];
  props?: Partial<TableComponent>;
}

function tableStoryFactory({
  title,
  HTMLTemplate,
  tableData,
  tableCols,
  props,
}: TableStory) {
  const defaultProps = {
    type: select('type', type, TableType.Primary, 'Props'),
    maxHeight: text('maxHeight', '450', 'Props'),
    rowSelection: select(
      'rowSelection',
      rowSelection,
      RowSelection.Multiple,
      'Props'
    ),
    removeColumnButtonEnabled: boolean(
      'removeColumnButtonEnabled',
      true,
      'Props'
    ),
    shouldAutoSizeColumns: boolean('shouldAutoSizeColumns', true, 'Props'),
    disableRowHoverBgColor: boolean('disableRowHoverBgColor', false, 'Props'),
    showColumnBorders: boolean('showColumnBorders', false, 'Props'),
    showActionsOnHover: boolean('showActionsOnHover', false, 'Props'),
    enablePager: boolean('enablePager', true, 'Props'),
    enableRowDrag: boolean('enableRowDrag', false, 'Props'),
    emptyStateConfig: object(
      'emptyStateConfig',
      {
        text: 'Surprise party',
        icon: Icons.cake,
        buttonLabel: 'Eat cake',
      },
      'Data'
    ),
    // columnDefs: object(`${title} columnDefs`, tableCols, 'Data'),
    // rowData: object(`${title} rowData`, tableData, 'Data'),
    columnDefs: of(object(`${title} columnDefs`, tableCols, 'Data')),
    rowData: of(object(`${title} rowData`, tableData, 'Data')),
    rowClicked: action('Row clicked'),
    cellClicked: action('Cell clicked'),
    selectionChanged: action('Selection changed'),
    sortChanged: action('Sort changed'),
    pagerPageSizeChange: action('Page size changed'),
    columnsOrderChanged: action('Column order changed'),
    columnRemoved: action('Column remove button clicked'),
    totalSelected: 0,
    onSearchChange: (str, table) => table.filterRows(str),
    onSelectionChanged: function ($event) {
      this.totalSelected = $event.length;
    },
  };

  return {
    template: HTMLTemplate,
    props: {
      ...defaultProps,
      ...props,
    },
    moduleMetadata: {
      declarations: [TreeCellAvatarComponent],
      entryComponents: [
        AvatarCellComponent,
        ActionsCellComponent,
        TreeCellAvatarComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        TableModule,
        AvatarModule,
        SearchModule,
        AgGridModule.withComponents([AvatarCellComponent]),
      ],
    },
  };
}

story.add(
  'Data Table',
  () =>
    tableStoryFactory({
      title: 'Data Table',
      HTMLTemplate: storyTemplate,
      tableCols: mockColumnsDefsExtended,
      tableData: mockRowData,
      props: { tableGridOptions: { getRowNodeId: (data) => data.id } },
    }),
  { notes: { markdown: note } }
);

story.add(
  'Tree Table',
  () =>
    tableStoryFactory({
      title: 'Tree Table',
      HTMLTemplate: treeStoryTemplate,
      tableCols: treeColumnDefsMock,
      tableData: treeRowDataMock,
      props: {
        isCollapsable: boolean('isCollapsable', false, 'Props'),
        treeConfig: {
          colDef: {
            headerName: 'Hierarchy Tree',
          },
          cellComponent: TreeCellAvatarComponent,
          dataGetter: (data) => data.data.orgHierarchy.data,
          hierarchyGetter: (data) => data.orgHierarchy.hierarchy,
        } as TreeConfig,
      } as any,
    }),
  { notes: { markdown: treeNotes } }
);
