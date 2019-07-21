import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  HostBinding
} from '@angular/core';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import {
  ButtonSize,
  ButtonType
} from '../../buttons-indicators/buttons/buttons.enum';
import { has } from 'lodash';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { MobileService } from '../../services/utils/mobile.service';
import { LinkColor } from '../../buttons-indicators/link/link.enum';
import { BreadcrumbsType } from './breadcrumbs.enum';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnChanges {
  @HostBinding('attr.type')
  @Input()
  type: BreadcrumbsType = BreadcrumbsType.primary;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() buttons: BreadcrumbNavButtons;
  @Input() activeIndex: number;

  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() prevClick: EventEmitter<number> = new EventEmitter<number>();

  isMobile: boolean;

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly linkColor = LinkColor;
  private resizeEventSubscriber: Subscription;

  constructor(
    private mobileService: MobileService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.mobileService.isMobileBreakpoint();

    this.resizeEventSubscriber = this.utilsService
      .getResizeEvent()
      .subscribe(() => {});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'buttons')) {
      this.buttons = changes.buttons.currentValue;
    }
  }

  onStepClick(stepIndex): void {
    this.stepClick.emit(stepIndex);
  }

  onNextClick(): void {
    this.nextClick.emit(this.activeIndex + 1);
  }

  onPrevClick(): void {
    this.prevClick.emit(this.activeIndex - 1);
  }
}
