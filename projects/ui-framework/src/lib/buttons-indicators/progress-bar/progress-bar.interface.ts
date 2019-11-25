import { Icons } from '../../icons/icons.enum';

export interface ProgressBarData {
  textHeaderLeft: string;
  textHeaderRight: string;
  iconHeaderRight: Icons;
}

export interface ProgressBarConfig {
  disableAnimation?: boolean;
}
