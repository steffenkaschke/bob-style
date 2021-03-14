import { Button } from '../../buttons/buttons.interface';
import { Icons, IconSize } from '../../icons/icons.enum';

export interface EmptyStateConfig {
  title?: string;
  text?: string;
  icon: Icons;
  iconSize?: IconSize;
  buttonLabel?: string;
  imgSrc?: string;
  button?: Button;
  buttonClick?: () => void;
}
