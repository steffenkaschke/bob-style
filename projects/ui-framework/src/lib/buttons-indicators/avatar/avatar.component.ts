import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarSize, BadgeSize, BadgeColor } from './avatar.enum';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() imageSource: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() isClickable = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() disabled = false;
  @Input() badge: string;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public  badgeConfig = {
    size: '',
    color: '',
  };
  readonly avatarSizeEnum = AvatarSize;
  constructor() { }

  ngOnInit() {
    if (this.badge) {
      this.badgeConfig.size = BadgeSize[this.size];
      this.badgeConfig.color = BadgeColor[this.badge];
    }
  }

  onClick(event) {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }

  getClassNames() {
    return `${this.size}${this.isClickable ? ' clickable' : ''}`;
  }
}
