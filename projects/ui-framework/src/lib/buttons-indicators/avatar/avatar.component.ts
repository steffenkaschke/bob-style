import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostBinding,
  SimpleChanges,
  OnChanges,
  OnInit
} from '@angular/core';
import {
  AvatarSize,
  BadgeSize,
  AvatarBadges,
  AvatarBadge,
  AvatarOrientation
} from './avatar.enum';
import { DOMhelpers, Styles } from '../../services/utils/dom-helpers.service';
import { ChipType } from '../chips/chips.enum';
import { Chip } from '../chips/chips.interface';
import { BadgeConfig } from './avatar.interface';
import { getKeyByValue } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(private host: ElementRef, private DOM: DOMhelpers) {}

  @ViewChild('content') private content: ElementRef;

  public hasContent = true;
  readonly avatarSize = AvatarSize;
  readonly badgeSize = BadgeSize;
  readonly chipType = ChipType;
  readonly orient = AvatarOrientation;
  public badgeConfig: BadgeConfig;
  public avatarClass: string;
  public avatarStyle: Styles;

  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() orientation: AvatarOrientation = AvatarOrientation.horizontal;

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

  ngOnInit(): void {
    this.setAvatarClass();
    this.setAvatarStyle();
    this.setCssVars();
    this.setBadgeConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageSource && !changes.imageSource.firstChange) {
      this.imageSource = changes.imageSource.currentValue;
      this.setAvatarClass();
      this.setAvatarStyle();
    }
    if (changes.backgroundColor && !changes.backgroundColor.firstChange) {
      this.backgroundColor = changes.backgroundColor.currentValue;
      this.setAvatarStyle();
    }
    if (changes.size && !changes.size.firstChange) {
      this.size = changes.size.currentValue;
      this.setCssVars();
    }
    if (changes.badge && !changes.badge.firstChange) {
      this.badge = changes.badge.currentValue;
      this.setBadgeConfig();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent =
        this.content && !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  setCssVars(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-size': this.size + 'px'
    });
  }

  setBadgeConfig(): void {
    this.badgeConfig = (this.badge as BadgeConfig).icon
      ? (this.badge as BadgeConfig)
      : AvatarBadges[this.badge as AvatarBadge];
  }

  setAvatarClass(): void {
    this.avatarClass =
      'avatar' +
      (this.imageSource && this.imageSource.includes('emptyAvatar')
        ? ' emptyAvatar'
        : '');
  }

  setAvatarStyle(): void {
    this.avatarStyle = {
      backgroundImage: this.imageSource
        ? 'url(' + this.imageSource + ')'
        : null,
      backgroundColor: this.backgroundColor
    };
  }

  onClick(event: any): void {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
