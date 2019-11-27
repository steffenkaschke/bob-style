import { SelectGroupOption } from '../list.interface';
import {
  selectSome,
  optionsMock as SingleListPptionsMock,
} from '../single-list/single-list.mock';
import { cloneDeep } from 'lodash';

export const optionsMock: SelectGroupOption[] = cloneDeep(
  //selectSome(
  SingleListPptionsMock
);

export const optionsMockDef: SelectGroupOption[] = selectSome(
  SingleListPptionsMock
);
