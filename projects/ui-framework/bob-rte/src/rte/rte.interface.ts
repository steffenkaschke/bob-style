import { GenericObject } from '../../../src/lib/types';

export interface RteMentionsOption {
  avatar?: string;
  displayName: string;
  link: string;
  attributes?: GenericObject;
}
