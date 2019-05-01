import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarSize, BadgeSize } from './avatar.enum';
import { BadgeConfig } from './avatar.interface';

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
  @Input() badge: BadgeConfig;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public  badgeSize: string;
  readonly avatarSizeEnum = AvatarSize;
  constructor() { }

  ngOnInit() {
    if (this.badge) {
      this.badgeSize = BadgeSize[this.size];
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
