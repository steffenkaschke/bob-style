import { Icons } from '../../icons/icons.enum';
import { Social } from './social.enum';

export interface SocialInputConfig {
  icon: Icons;
  prefix: string;
}

export const SocialTypes: { [key in Social]: SocialInputConfig } = {
  [Social.facebook]: {
    icon: Icons.facebook,
    prefix: 'www.facebook.com/'
  },
  [Social.linkedin]: {
    icon: Icons.linkedin,
    prefix: 'www.linkedin.com/'
  },
  [Social.twitter]: {
    icon: Icons.twitter,
    prefix: 'www.twitter.com/'
  }
};
