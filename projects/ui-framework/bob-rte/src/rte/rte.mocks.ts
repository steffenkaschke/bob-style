import {
  mockNames,
  mockAvatar,
  mockText,
  makeArray,
  randomNumber,
  simpleUID,
  SelectGroupOption
} from 'bob-style';
import { RteMentionsOption } from './rte.interface';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar()
  })
);

export const placeholderMock: SelectGroupOption[] = [
  {
    groupName: 'Basic Info',
    key: 'basic',
    options: [
      {
        id: 'basic/firstName',
        value: 'First name'
      },
      {
        id: 'basic/lastName',
        value: 'Last name'
      },
      {
        id: 'basic/fullName',
        value: 'Full name'
      },
      {
        id: 'basic/email',
        value: 'E-mail'
      }
    ]
  },
  {
    groupName: 'Work',
    key: '/work',
    options: [
      {
        id: '/work/title',
        value: 'Title'
      },
      {
        id: '/work/team',
        value: 'Team'
      },
      {
        id: '/work/site',
        value: 'Site'
      }
    ]
  }
].concat(
  makeArray(15).map(i => {
    const groupId = simpleUID('/', 4);

    return {
      groupName: mockText(randomNumber(1, 3)),
      key: groupId,
      options: makeArray(randomNumber(10, 25)).map(i => ({
        id: groupId + '/' + simpleUID(),
        value: mockText(randomNumber(1, 3))
      }))
    };
  })
);
