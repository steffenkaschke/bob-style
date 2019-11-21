import { SelectOption } from '../list.interface';
import {
  makeArray,
  simpleUID,
  randomNumber,
} from '../../services/utils/functional-utils';
import { mockAnimals } from '../../mock.const';

export const editableListMock: SelectOption[] = makeArray(10).map(i => ({
  id: simpleUID(),
  value: mockAnimals(1),
  selected: randomNumber() > 90,
}));
