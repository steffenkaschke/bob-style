import { SelectGroupOption } from '../list.interface';
import {
  makeArray,
  simpleUID,
  randomNumber,
} from '../../../services/utils/functional-utils';
import { mockAvatar, mockNames, mockJobs } from '../../../mock.const';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';

const groupNum = 6;
const optionsNum = 4;

export const optionsMock: SelectGroupOption[] = makeArray(groupNum).map(
  group => {
    const groupId = simpleUID();

    return {
      groupName: mockJobs(1),
      key: groupId,

      options: makeArray(optionsNum).map(option => ({
        id: simpleUID(groupId + '/', 3),
        value: mockNames(1),
        selected: randomNumber() > 80,
        disabled: randomNumber() > 90,
        prefixComponent: {
          component: AvatarComponent,
          attributes: {
            imageSource: mockAvatar(),
          },
        },
      })),
    };
  }
);

export const optionsMockDef: SelectGroupOption[] = makeArray(2).map(group => {
  const groupId = simpleUID();

  return {
    groupName: mockJobs(1),
    key: groupId,

    options: makeArray(3).map(option => ({
      id: simpleUID(groupId + '/', 3),
      value: mockNames(1),
      selected: true,
      disabled: false,
      prefixComponent: {
        component: AvatarComponent,
        attributes: {
          imageSource: mockAvatar(),
        },
      },
    })),
  };
});
