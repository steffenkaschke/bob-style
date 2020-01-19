import { ICellRendererParams } from 'ag-grid-community';
import {Icons, MenuItem} from 'bob-style';
import {ActionsType} from '../table-actions-wrapper/table-actions-wrapper.enum';

export interface CircleIconAndLabelParams extends ICellRendererParams {
  value: {
    icon?: Icons;
    label?: string;
    menuItems?: MenuItem[];
    actionsType?: ActionsType;
  };
}
