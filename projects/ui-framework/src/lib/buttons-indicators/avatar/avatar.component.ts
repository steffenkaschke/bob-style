import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { AvatarSize, BadgeSize } from './avatar.enum';
import { BadgeConfig } from './avatar.interface';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @Input() imageSource: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() isClickable = false;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() disabled = false;
  @Input() badge: BadgeConfig;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public badgeSize: string;
  public avatarClass: string;
  public avatarStyle: object;
  public titleClass: string;
  public hasContent = true;
  readonly avatarSizeEnum = AvatarSize;
  constructor(private DOM: DOMhelpers) {}

  ngOnInit() {
    if (this.badge) {
      this.badgeSize = BadgeSize[this.size];
    }

    this.avatarClass =
      'avatar-' +
      this.size +
      (this.isClickable && !this.disabled ? ' clickable' : '') +
      (this.disabled ? ' disabled' : '') +
      (this.imageSource.includes('emptyAvatar') ? ' emptyAvatar' : '');

    this.avatarStyle = {
      backgroundImage: 'url(' + this.imageSource + ')'
    };

    this.titleClass =
      'avatar-title-' + this.size + (this.disabled ? ' disabled' : '');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent = !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  onClick(event) {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
