import { mockNames, mockAvatar, mockText } from '../../mock.const';
import { RteMentionsOption } from './rte.interface';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar()
  })
);
