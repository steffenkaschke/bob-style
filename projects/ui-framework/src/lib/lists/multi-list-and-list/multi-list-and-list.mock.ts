import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import {
  simpleUID,
  randomNumber,
  randomFromArray,
  arrayDifference,
} from '../../services/utils/functional-utils';
import { mockHobbies, mockNames, mockAvatar } from '../../mock.const';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { Icons } from '../../icons/icons.enum';
import { BasicListItem } from 'bob-style';

const maxOpts = 10;

const oldPeopleHobbies = randomFromArray(mockHobbies(), maxOpts);
const couplesHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies),
  maxOpts,
);
const kidsHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies.concat(couplesHobbies)),
  maxOpts,
);

const mayBeSelected = (perc = 80) => {
  return randomNumber() > perc;
};

export const MultiListAndListTimeOffOptionsMock: SelectGroupOption[] = [
  {
    groupIndex: 0,
    groupName: 'Holiday',
    key: '0__Holiday',
    options: [
      {
        strongParent: true,
        id: 6936222,
        value: 'Holiday policy',
        exclusive: true,
      },
    ],
  },
  {
    groupIndex: 1,
    groupName: 'Sick',
    key: '1__Sick',
    options: [
      {
        strongParent: true,
        id: 6923623,
        value: 'Sick policy',
        exclusive: true,
      },
    ],
  },
  {
    groupIndex: 2,
    groupName: 'Time off in lieu',
    key: '2__Time off in lieu',
    options: [
      {
        strongParent: true,
        value: 'Time Off in Lieu policy',
        id: 6932624,
      },
    ],
  },
  {
    groupIndex: 3,
    groupName: 'test1',
    key: '3__test1',
    options: [
      {
        selected: false,
        strongParent: true,
        value: 'test1.sub',
        subValue: '16 days',
        id: 7423814,
      },
      {
        selected: true,
        strongParent: true,
        value: 'sub2',
        subValue: '10 days',
        id: 7432822,
      },
    ],
  },
];
export const MultiListAndListOptionsMock: SelectGroupOption[] = [
  {
    groupName: 'All',
    key: 'all',
    options: [
      {
        id: 'all',
        value: 'All',
        exclusive: true,
      },
    ],
  },
  {
    groupName: 'For kids',
    options: kidsHobbies.map((hobby, index) => ({
      value: hobby,
      id: simpleUID(),
      selected: index === 1 || mayBeSelected(),
      disabled: index === 1,
    })),
  },
  {
    groupName: 'For couples',
    options: couplesHobbies.map((hobby, index) => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected(),
      disabled: index === 2,
    })),
  },
  {
    groupName: 'For old people',
    options: oldPeopleHobbies.map((hobby) => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected(),
    })),
  },
  {
    groupName: 'Group with empty options',
    options: [],
  },
];

export const MultiListAndListPepopleOptionsMock: SelectGroupOption[] = [
  {
    groupName: 'All',
    key: 'all',
    options: [
      {
        id: 'all',
        value: 'All',
        exclusive: true,
      },
    ],
  },
  {
    groupName: 'People',
    options: [
      {
        value: 'Manager',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: Icons.person_manager,
          },
        },
      },
      {
        value: 'Reports To',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: Icons.person_reports,
          },
        },
      },
      ...mockNames(30).map(
        (person: string, index: number): SelectOption => ({
          value: person,
          id: simpleUID(),
          selected: index < 15 && mayBeSelected(85),
          disabled: false,
          prefixComponent: {
            component: AvatarImageComponent,
            attributes: {
              imageSource: mockAvatar(),
            },
          },
        }),
      ),
    ],
  },
];

export const listData: BasicListItem[] = [{
  label: 'label only',
},
  {
    label: 'label icon and menu',
    icon: Icons.doc,
    menuIcon: Icons.three_dots,
    disabled: true,
    menu: [{ label: 'Delete' }, { label: 'Edit' }],
  },
  {
    label: [
      '<strong> strong label</strong> - child ',
      'action icon',
    ],
    icon: Icons.doc,
    menuIcon: Icons.delete,
  },
  {
    label: [
      '<strong> strong label 2</strong> - child2 ',
      'text',
    ],
    menuIcon: Icons.delete,
    icon: null,
  },
  {
    label: 'label icon and menu',
    icon: Icons.doc,
    disabled: false,
    menu: [
      {
        label: 'Et eos',
      },
      {
        label: 'Dolor',
      },
    ],
  },
  {
    label: 'label and icon',
    icon: Icons.doc,
  },
  {
    label: 'label only',
  },
];
