import { SelectGroupOption } from '../list.interface';
import { makeArray, simpleUID } from '../../../services/utils/functional-utils';
import { mockAvatar, mockNames, mockJobs } from '../../../mock.const';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';

const groupNum = 6;
const optionsNum = 4;

const groupNames = mockJobs();

export const optionsMock: SelectGroupOption[] = makeArray(groupNum).map(
  (group, index) => {
    const groupId = simpleUID();

    return {
      groupName: groupNames[index],
      key: groupId,

      options: makeArray(optionsNum).map(option => ({
        id: groupId + '/' + simpleUID(),
        value: mockNames(1),
        selected: false,
        disabled: false,
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
