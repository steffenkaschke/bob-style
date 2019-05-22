import { Icons, IconColor } from '../../icons/icons.enum';

export enum AvatarSize {
  mini = 36,
  small = 60,
  medium = 96,
  large = 128
}

export enum AvatarOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

export enum BadgeSize {
  mini = 'medium',
  small = 'medium',
  medium = 'large',
  large = 'large'
}

export enum AvatarBadge {
  approved = 'approved',
  pending = 'pending',
  rejected = 'rejected'
}

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
