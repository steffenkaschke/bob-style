import { SelectGroupOption } from '../list.interface';
import { makeArray, simpleUID } from '../../../services/utils/functional-utils';
import { mockAvatar, mockNames, mockJobs } from '../../../mock.const';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';

const groupNum = 3;
const optionsNum = 4;

export const optionsMock: SelectGroupOption[] = makeArray(groupNum).map(
  group => {
    const groupId = simpleUID();

    return {
      groupName: mockJobs(1),
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
optionsMock[0].options[1].selected = true;
optionsMock[0].options[3].disabled = true;
