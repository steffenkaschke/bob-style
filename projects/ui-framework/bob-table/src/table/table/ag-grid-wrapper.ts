import {RowNode, GridOptions} from 'ag-grid-community';
import {once} from 'lodash';

const LICENSE_KEY =
  'hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155';


export class AgGridWrapper {

  static isLicenseSet = false;
  readonly tableLicense = once(() =>
      // @ts-ignore
      import('ag-grid-enterprise').then(agGrig => {
        if (!AgGridWrapper.isLicenseSet) {
          AgGridWrapper.isLicenseSet = true;
          agGrig.LicenseManager.setLicenseKey(LICENSE_KEY);
        }
      })
  );

  protected gridOptions: GridOptions;

  constructor() {
    this.tableLicense();
  }

  protected setGridOptions(gridOptions: GridOptions) {
    this.gridOptions = gridOptions;
  }

  public getDisplayedRowCount(): number {
    return this.gridOptions.api.getDisplayedRowCount();
  }

  public addRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ add: rows });
  }

  public filterRows(filterQuery: string): void {
    this.gridOptions.api.setQuickFilter(filterQuery);
  }

  public resetFilter(): void {
    this.gridOptions.api.resetQuickFilter();
  }

  public removeRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ remove: rows });
  }

  public updateRows(rowsData: any[]): void {
    this.gridOptions.api.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.gridOptions.api.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.gridOptions.api.deselectAll();
  }

}
