import { Icons } from '../../icons/icons.enum';

export interface ProgressBarData {
  value: number;
  color?: string;
  textHeaderLeft?: string;
  textHeaderRight?: string;
  iconHeaderRight?: Icons;
}

export interface ProgressBarConfig {
  disableAnimation?: boolean;
}
