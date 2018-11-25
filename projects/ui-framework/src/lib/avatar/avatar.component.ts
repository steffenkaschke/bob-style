import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() size?: AvatarSize;
  @Output() handleClick?: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    console.log('this.handleClick', this.handleClick);
  }
}
