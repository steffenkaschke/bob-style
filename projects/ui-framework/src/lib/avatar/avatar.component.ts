import { Component, Input, Output, EventEmitter } from '@angular/core';

export enum AvatarSize {
  mini = 'mini',
  small = 'small',
  medium  = 'medium',
  large  = 'large',
}

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() imageSource: string;
  @Input() size?: AvatarSize = AvatarSize.mini;
  @Input() isClickable ? = false;
  @Output() handleClick?: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  onClick(event) {
    this.handleClick.emit(event);
  }

  getClassNames() {
    return `${this.size}${this.isClickable ? ' clickable' : ''}`;
  }

}
