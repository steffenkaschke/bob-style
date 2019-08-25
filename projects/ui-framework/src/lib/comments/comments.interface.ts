import {Icons} from '../icons/icons.enum';
import {MenuItem} from '../navigation/menu/menu.interface';
import {CardActionButton} from '../cards/card/card.interface';

export interface CommentItem {
  avatar: string;
  name: string;
  content: string;
  actionConfig?: CardActionButton;
  menuConfig?: MenuItem[];
}
export interface CommentItemDto {
  content: string;
}
export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?($event): void;
}
