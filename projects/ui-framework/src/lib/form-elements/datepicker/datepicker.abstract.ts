import {
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { Subscription } from 'rxjs';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { simpleUID, isKey } from '../../services/utils/functional-utils';
import { dateOrFail } from '../../services/utils/transformers';
import { BDateAdapter } from './date.adapter';
import { MatDatepicker, MatDatepickerInput } from '@angular/material';
import { DateTimeInputService } from './date-time-input.service';
import { Keys } from '../../enums';

export abstract class BaseDatepickerElement extends BaseFormElement
  implements OnInit, OnDestroy {
  constructor(
    protected mobileService: MobileService,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected dtInputSrvc: DateTimeInputService
  ) {
    super();
  }
  // @ViewChild(CdkOverlayOrigin, { static: true })
  // overlayOrigin: CdkOverlayOrigin;

  @ViewChildren(MatDatepicker) public pickers: QueryList<MatDatepicker<any>>;
  @ViewChildren(MatDatepickerInput, { read: ElementRef })
  public inputs: QueryList<ElementRef>;

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
        this.allPickers(picker => {
          picker.close();
        });
        this.isMobile = media.matchMobile;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.mediaEventSubscription) {
      this.mediaEventSubscription.unsubscribe();
    }
  }

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    this.allPickers(picker => {
      picker.close();
    });

    if (changes.minDate) {
      this.minDate = dateOrFail(changes.minDate.currentValue);
    }

    if (changes.maxDate) {
      this.maxDate = dateOrFail(changes.maxDate.currentValue);
    }

    if (!this.placeholder && !(this.hideLabelOnFocus && this.label)) {
      this.placeholder = BDateAdapter.bFormat.toLowerCase();
    }
  }

  protected getPicker(index: string | number): MatDatepicker<any> {
    return this.pickers
      ? this.pickers.toArray()[parseInt(index as string, 10)]
      : null;
  }

  protected allPickers(func: (p: MatDatepicker<any>) => any): void {
    if (this.pickers) {
      this.pickers
        .toArray()
        .forEach((picker: MatDatepicker<any>) => func(picker));
    }
  }

  protected getInput(index: string | number): HTMLInputElement {
    return this.inputs
      ? this.inputs.toArray()[parseInt(index as string, 10)].nativeElement
      : null;
  }

  protected allInputs(func: (p: HTMLInputElement) => any): void {
    if (this.inputs) {
      this.inputs
        .toArray()
        .forEach((input: ElementRef) =>
          func(input.nativeElement as HTMLInputElement)
        );
    }
  }

  public onInputFocus(index: number): void {
    this.inputFocused = true;
    this.openPicker(index);
  }

  public onInputBlur(index: number): void {
    if (!this.getPicker(index).opened) {
      this.inputFocused = false;
    }
  }

  public openPicker(index: number) {
    if (!this.getPicker(index).opened) {
      this.getPicker(index).open();
    }
  }

  public closePicker(index: number) {
    if (this.getPicker(index).opened) {
      this.getPicker(index).close();
    }
  }

  public onPickerOpen(index: number): void {
    this.inputFocused = true;
  }

  public onPickerClose(index: number): void {
    this.inputFocused = false;
  }

  public onInputKeydown(index: number, event: KeyboardEvent): void {
    this.dtInputSrvc.filterAllowedKeys(event);

    if (isKey(event.key, Keys.enter)) {
      this.closePicker(index);
    }
  }

  public onInputChange(index: number, event): void {
    (event.target as HTMLInputElement).value = this.dtInputSrvc.convertSeparators(
      (event.target as HTMLInputElement).value
    );
  }
}
