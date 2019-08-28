import {
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { Subscription } from 'rxjs';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { simpleUID } from '../../services/utils/functional-utils';
import { dateOrFail } from '../../services/utils/transformers';
import { BDateAdapter } from './date.adapter';

export abstract class BaseDatepickerElement extends BaseFormElement
  implements OnInit, OnDestroy {
  // @ViewChild(CdkOverlayOrigin, { static: true })
  // overlayOrigin: CdkOverlayOrigin;

  constructor(
    protected mobileService: MobileService,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone
  ) {
    super();
  }

  @Input() minDate?: Date | string;
  @Input() maxDate?: Date | string;
  @Input() dateFormat?: string;

  public id = simpleUID('bdp-');

  public isMobile = false;
  private mediaEventSubscription: Subscription;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;

  protected onDatepickerChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.mediaEventSubscription = this.mobileService
      .getMediaEvent()
      .pipe(outsideZone(this.zone))
      .subscribe((media: MediaEvent) => {
        this.isMobile = media.matchMobile;
      });
  }

  ngOnDestroy(): void {
    if (this.mediaEventSubscription) {
      this.mediaEventSubscription.unsubscribe();
    }
  }

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.minDate) {
      this.minDate = dateOrFail(changes.minDate.currentValue);
    }

    if (changes.maxDate) {
      this.maxDate = dateOrFail(changes.maxDate.currentValue);
    }

    if (!this.placeholder && !(this.hideLabelOnFocus && this.label)) {
      this.placeholder = BDateAdapter.bFormat.toLowerCase();
    }

    this.onDatepickerChanges(changes);
  }
}
