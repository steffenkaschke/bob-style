import { Icons, IconColor, IconSize } from '../../icons/icons.enum';

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
  [AvatarSize.mini]: IconSize.medium,
  [AvatarSize.small]: IconSize.medium,
  [AvatarSize.medium]: IconSize.large,
  [AvatarSize.large]: IconSize.large
};

export const AvatarBadges = {
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

export enum AvatarPresets {
  default = 'default',
  BigNameMiddleJobSmallDepartment = 'BigNameMiddleJobSmallDepartment',
  BigNameMiddleJob = 'BigNameMiddleJob',
  MediumNameSmallJob = 'MediumNameSmallJob',
  SmallJob = 'SmallJob',
  SmallName = 'SmallName'
}

// represents order of how data is placed in slots
// 0 - name (title input), 1 - job (subtitle input), 2 - department (caption input)
export const AvatarPresetValues = {
  [AvatarPresets.BigNameMiddleJobSmallDepartment]: [0, 1, 2],
  [AvatarPresets.BigNameMiddleJob]: [0, 1],
  [AvatarPresets.MediumNameSmallJob]: [null, 0, 1],
  [AvatarPresets.SmallJob]: [null, null, 1],
  [AvatarPresets.SmallName]: [null, null, 0]
};

export const AvatarDefaultPresetValues = {
  [AvatarSize.mini]: {
    [AvatarOrientation.horizontal]:
      AvatarPresetValues[AvatarPresets.MediumNameSmallJob],
    [AvatarOrientation.vertical]:
      AvatarPresetValues[AvatarPresets.MediumNameSmallJob]
  },
  [AvatarSize.small]: {
    [AvatarOrientation.horizontal]:
      AvatarPresetValues[AvatarPresets.MediumNameSmallJob],
    [AvatarOrientation.vertical]: AvatarPresetValues[AvatarPresets.SmallName]
  },
  [AvatarSize.medium]: {
    [AvatarOrientation.horizontal]:
      AvatarPresetValues[AvatarPresets.BigNameMiddleJob],
    [AvatarOrientation.vertical]:
      AvatarPresetValues[AvatarPresets.BigNameMiddleJob]
  },
  [AvatarSize.large]: {
    [AvatarOrientation.horizontal]:
      AvatarPresetValues[AvatarPresets.BigNameMiddleJobSmallDepartment],
    [AvatarOrientation.vertical]:
      AvatarPresetValues[AvatarPresets.BigNameMiddleJobSmallDepartment]
  }
};
