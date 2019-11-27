import { SelectGroupOption } from '../list.interface';
import {
  selectSome,
  optionsMock as SingleListPptionsMock,
} from '../single-list/single-list.mock';

export const optionsMock: SelectGroupOption[] = selectSome(
  SingleListPptionsMock //.slice(0, 1)
);

export const optionsMockDef: SelectGroupOption[] = selectSome(
  SingleListPptionsMock
);
