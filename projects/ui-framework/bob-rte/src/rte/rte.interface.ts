import { GenericObject } from 'bob-style';

export interface RteMentionsOption {
  avatar?: string;
  displayName: string;
  link: string;
  attributes?: GenericObject;
}

export interface RteTranslation {
  add_variable: string;
}
