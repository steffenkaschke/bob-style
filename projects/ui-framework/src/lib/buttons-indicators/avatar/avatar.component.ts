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

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, AfterViewInit {
  constructor(private host: ElementRef, private DOM: DOMhelpers) {}

  @ViewChild('content') private content: ElementRef;

  @Input() imageSource: string;
  @Input() backgroundColor?: string;
  @Input() size: AvatarSize = AvatarSize.mini;
  @Input() orientation: AvatarOrientation = AvatarOrientation.horizontal;

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() status?: Chip;
  @Input() department?: any;

  @Input() badge: AvatarBadge;

  @Input() isClickable = false;
  @Input() disabled = false;

  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  public hasContent = true;
  readonly avatarSize = AvatarSize;
  readonly badgeSize = BadgeSize;
  readonly chipType = ChipType;
  readonly badges = AvatarBadgeMap;

  ngOnInit(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--avatar-size': this.size + 'px'
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent =
        this.content && !this.DOM.isEmpty(this.content.nativeElement);
    }, 0);
  }

  getSizeClass(value: any): string {
    return Object.keys(AvatarSize).find(key => AvatarSize[key] === value);
  }

  onClick(event: any): void {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }
}
