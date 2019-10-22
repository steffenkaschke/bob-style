import { mockNames, mockAvatar } from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { RteMentionsOption } from './rte.interface';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    id: simpleUID(),
    avatar: mockAvatar()
  })
);
