import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostBinding,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  AvatarSize,
  BadgeSize,
  AvatarBadgeMap,
  AvatarBadge,
  AvatarOrientation
} from './avatar.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { ChipType } from '../chips/chips.enum';
import { Chip } from '../chips/chips.interface';
import { BadgeConfig } from './avatar.interface';
import {
  setPropsOnChanges,
  getKeyByValue
} from '../../services/utils/functional-utils';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges, AfterViewInit {
  constructor(private host: ElementRef, private DOM: DOMhelpers) {}

  @ViewChild('content') private content: ElementRef;

  public hasContent = true;
  readonly avatarSize = AvatarSize;
  readonly badgeSize = BadgeSize;
  readonly chipType = ChipType;
  readonly orient = AvatarOrientation;
  public badgeConfig: BadgeConfig;
  public data: string[] = [];

  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() orientation: AvatarOrientation = AvatarOrientation.horizontal;

  @Input() preset;

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() chip?: Chip;
  @Input() caption?: string;
  @Input() badge: AvatarBadge | BadgeConfig;
  @Input() isClickable = false;
  @Input() disabled = false;

  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class')
  get typeClass() {
    return (
      getKeyByValue(AvatarSize, this.size) +
      ' ' +
      this.orientation +
      (this.isClickable ? ' clickable' : '') +
      (this.disabled ? ' disabled' : '')
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    setPropsOnChanges(
      ['size', 'badge', 'title', 'subtitle', 'caption'],
      changes,
      this
    );

    if (changes.size) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--avatar-size': this.size + 'px'
      });
    }

    if (changes.badge) {
      this.badgeConfig = (changes.badge.currentValue as BadgeConfig).icon
        ? (changes.badge.currentValue as BadgeConfig)
        : AvatarBadgeMap[changes.badge.currentValue as AvatarBadge];
    }

    if (changes.title || changes.subtitle || changes.caption) {
      this.data = [this.title, this.subtitle, this.caption];
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent =
        this.content && !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  onClick(event: any): void {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
