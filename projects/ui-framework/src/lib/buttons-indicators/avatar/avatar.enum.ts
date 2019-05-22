import { Icons, IconColor } from '../../icons/icons.enum';

export enum AvatarSize {
  mini = 36,
  small = 60,
  medium = 90,
  large = 120
}

export enum AvatarOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

export enum AvatarBadge {
  approved = 'approved',
  pending = 'pending',
  rejected = 'rejected'
}

export const BadgeSize = {
  [AvatarSize.mini]: 'medium',
  [AvatarSize.small]: 'medium',
  [AvatarSize.medium]: 'large',
  [AvatarSize.large]: 'large'
};

export const AvatarBadgeMap = {
  [AvatarBadge.approved]: {
    icon: Icons.success,
    color: IconColor.positive
  },
  [AvatarBadge.pending]: {
    icon: Icons.timeline,
    color: IconColor.primary
  },
  [AvatarBadge.rejected]: {
    icon: Icons.error,
    color: IconColor.negative
  }
};
