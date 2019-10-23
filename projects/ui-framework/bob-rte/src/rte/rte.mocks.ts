import { mockNames, mockAvatar, mockText } from 'bob-style';
import { RteMentionsOption } from './rte.interface';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar()
  })
);

export const placeholderMock = [
  {
    groupName: 'Basic Info - header',
    options: [
      {
        displayName: 'First name',
        id: '/root/firstName',
        value: 'First name'
      },
      {
        displayName: 'title',
        id: '/work/title',
        category: 'Work',
        value: 'title'
      }
    ]
  }
];
