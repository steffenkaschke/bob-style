import { mockNames, mockAvatar } from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';

export const mentionsOptions = mockNames(200).map(name => ({
  displayName: name,
  id: simpleUID(),
  avatar: mockAvatar()
}));
