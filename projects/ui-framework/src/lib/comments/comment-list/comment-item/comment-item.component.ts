import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {CommentItem} from '../../comments.interface';
import {AvatarSize} from '../../../avatar/avatar/avatar.enum';
import {ButtonSize, ButtonType} from '../../../buttons/buttons.enum';
import {IconColor, Icons} from '../../../icons/icons.enum';

@Component({
  selector: 'b-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: [
    '../../comments.scss',
    './comment-item.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentItemComponent {
  readonly avatarSize = AvatarSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly buttonSize = ButtonSize;
  @Input() comment: CommentItem;

  @HostBinding('attr.data-focus-inside') menuIsOpened: boolean;

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

}
