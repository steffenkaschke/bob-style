import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isEmpty } from 'lodash';

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
export class AvatarComponent implements OnInit {
  @Input() imageSource: string;
  @Input() size?: AvatarSize = AvatarSize.mini;
  @Output() handleClick?: EventEmitter<void> = new EventEmitter<void>();

  public isClickable: boolean;

  constructor() { }

  ngOnInit() {
    this.isClickable = !isEmpty(this.handleClick.observers);
  }

  onClick(event) {
    this.handleClick.emit(event);
  }

  getClassNames() {
    return `${this.size}${this.isClickable ? ' clickable' : ''}`;
  }

}
