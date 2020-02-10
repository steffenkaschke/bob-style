import { HierarchyListOption } from './hierarchy-list.interface';
import {
  makeArray,
  randomNumber,
  simpleUID,
} from '../../services/utils/functional-utils';
import { mockText, mockAnimals } from '../../mock.const';

const groupProbability = 40;
const maxDepth = 3;
const groupItemsMinMax: [number, number] = [4, 8];

const genOption = () =>
  ({
    id: simpleUID('opt-', 7),
    name: mockText(randomNumber(1, 3)),
  } as HierarchyListOption);

const genGroup = (depthCounter = 0) =>
  ({
    id: simpleUID('grp-', 7),
    name: mockText(randomNumber(1, 3)),
    children: makeArray(randomNumber(...groupItemsMinMax)).map(() =>
      genGroupOrOption(depthCounter + 1)
    ) as HierarchyListOption[],
  } as HierarchyListOption);

const genGroupOrOption = (depthCounter = 0) => {
  const doGroup = randomNumber() > 100 - groupProbability;

  return doGroup && depthCounter <= maxDepth
    ? genGroup(depthCounter)
    : genOption();
};

export const HListMock: HierarchyListOption[] = makeArray(5).map(() =>
  genGroupOrOption(1)
);
if (!HListMock.find(i => i.children)) {
  HListMock[0] = genGroup(1);
}

export const HListMockSimple: HierarchyListOption[] = makeArray(5).map(
  (i, indx) => {
    if (indx === 1) {
      return ({
        id: 'group-1',
        name: 'O' + (indx + 1) + ' Group 1',
        selected: true,
        animal: mockAnimals(1),
        children: [
          {
            id: 'group-2',
            name: 'O' + (indx + 1) + ' G1 O1 Group 2',
            animal: mockAnimals(1),
            children: makeArray(5).map(
              (i, ndx) =>
                ({
                  id: 'group-2-option-' + (ndx + 1),
                  name: 'O2 G1 O1 G2 Option ' + (ndx + 1),
                  animal: mockAnimals(1),
                } as HierarchyListOption)
            ),
          } as HierarchyListOption,
          ...makeArray(5).map(
            (i, ndx) =>
              ({
                id: 'group-1-option-' + (ndx + 1),
                name: '02 G1 Option ' + (ndx + 1),
                animal: mockAnimals(1),
              } as HierarchyListOption)
          ),
        ],
      } as any) as HierarchyListOption;
    }

    return {
      id: 'option-' + (indx + 1),
      name: 'Option ' + (indx + 1),
      animal: mockAnimals(1),
    } as HierarchyListOption;
  }
);
