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
  Output,
  EventEmitter
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { Subscription, fromEvent, interval } from 'rxjs';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { outsideZone } from '../../services/utils/rxjs.operators';
import {
  simpleUID,
  isKey,
  notFirstChanges
} from '../../services/utils/functional-utils';
import { dateOrFail } from '../../services/utils/transformers';
import { BDateAdapter } from './date.adapter';
import { MatDatepicker, MatDatepickerInput } from '@angular/material';
import { DateTimeInputService } from './date-time-input.service';
import { Keys } from '../../enums';
import { DOMhelpers, Styles } from '../../services/utils/dom-helpers.service';
import { throttle } from 'rxjs/operators';
import { WindowRef } from '../../services/utils/window-ref.service';
import { InputEventType, FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';
import { set } from 'lodash';

export abstract class BaseDatepickerElement extends BaseFormElement
  implements OnInit, OnDestroy {
  constructor(
    protected windowRef: WindowRef,
    protected mobileService: MobileService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected dtInputSrvc: DateTimeInputService
  ) {
    super();
  }

  @ViewChild('inputWrap', { static: true }) inputWrap: ElementRef;
  @ViewChildren(MatDatepicker) public pickers: QueryList<MatDatepicker<any>>;
  @ViewChildren(MatDatepickerInput, { read: ElementRef })
  public inputs: QueryList<ElementRef>;

  @Input() minDate: Date | string;
  @Input() maxDate: Date | string;
  @Input() allowKeyInput = true;
  @Input() dateFormat: string;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public id = simpleUID('bdp-');
  public isMobile = false;
  public inputFocused: boolean[] = [];

  protected overlayStylesDef: Styles = {};

  private allowInputBlur = !this.allowKeyInput;
  private resizeSubscription: Subscription;
  private mediaEventSubscription: Subscription;
  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;

  ngOnInit(): void {
    this.resizeSubscription = fromEvent(this.windowRef.nativeWindow, 'resize')
      .pipe(
        outsideZone(this.zone),
        throttle(val => interval(1000))
      )
      .subscribe(() => {
        if (!this.isMobile) {
          this.allPickers(picker => this.closePicker(picker));
          this.cd.detectChanges();
        }
      });

    this.mediaEventSubscription = this.mobileService
      .getMediaEvent()
      .pipe(outsideZone(this.zone))
      .subscribe((media: MediaEvent) => {
        this.allPickers(picker => this.closePicker(picker));
        this.isMobile = media.matchMobile;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.mediaEventSubscription) {
      this.mediaEventSubscription.unsubscribe();
    }
  }

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    this.allPickers(picker => this.closePicker(picker));

    if (changes.minDate) {
      this.minDate = dateOrFail(changes.minDate.currentValue);
    }

    if (changes.maxDate) {
      this.maxDate = dateOrFail(changes.maxDate.currentValue);
    }

    if (!this.placeholder && !(this.hideLabelOnFocus && this.label)) {
      this.placeholder = BDateAdapter.bFormat.toLowerCase();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected getPicker(index: string | number): MatDatepicker<any> {
    return this.pickers && this.pickers.length > 0
      ? this.pickers.toArray()[parseInt(index as string, 10)]
      : null;
  }

  protected allPickers(func: (p: MatDatepicker<any>) => any): void {
    if (this.pickers && this.pickers.length > 0) {
      this.pickers
        .toArray()
        .forEach((picker: MatDatepicker<any>) => func(picker));
    }
  }

  protected getInput(index: string | number): HTMLInputElement {
    return this.inputs && this.inputs.length > 0
      ? this.inputs.toArray()[parseInt(index as string, 10)].nativeElement
      : null;
  }

  protected allInputs(func: (p: HTMLInputElement) => any): void {
    if (this.inputs && this.inputs.length > 0) {
      this.inputs
        .toArray()
        .forEach((input: ElementRef) =>
          func(input.nativeElement as HTMLInputElement)
        );
    }
  }

  protected getOverlayStyles(): Styles {
    if (this.inputWrap) {
      const overlayBox = this.inputWrap.nativeElement.getBoundingClientRect();

      return {
        ...this.overlayStylesDef,
        'pointer-events': 'none',
        left: overlayBox.left + 'px',
        right: overlayBox.right - overlayBox.width + 'px',
        width: overlayBox.width + 'px'
      };
    }
    return {};
  }

  public openPicker(picker: MatDatepicker<any> | number = 0): void {
    if (typeof picker === 'number') {
      picker = this.getPicker(picker);
    }
    if (!picker.opened) {
      picker.open();
    }
  }

  public closePicker(picker: MatDatepicker<any> | number = 0): void {
    if (typeof picker === 'number') {
      picker = this.getPicker(picker);
    }
    if (picker.opened) {
      picker.close();
    }
  }

  public onPickerOpen(index: number = 0): void {
    this.inputFocused[index] = true;
    if (this.allowKeyInput && !this.isMobile) {
      this.getInput(index).focus();
    }
    const picker = this.getPicker(index);

    if (picker._popupRef) {
      this.zone.runOutsideAngular(() => {
        this.windowRef.nativeWindow.requestAnimationFrame(() => {
          this.DOM.setCssProps(
            picker._popupRef.overlayElement,
            this.getOverlayStyles()
          );
        });
      });
    }

    if (
      (picker as any)._dialogRef &&
      (picker as any)._dialogRef._overlayRef &&
      (picker as any)._dialogRef._overlayRef.overlayElement
    ) {
      this.zone.runOutsideAngular(() => {
        this.windowRef.nativeWindow.requestAnimationFrame(() => {
          this.DOM.setCssProps(
            (picker as any)._dialogRef._overlayRef.overlayElement,
            this.overlayStylesDef
          );
        });
      });
    }
  }

  public onPickerClose(index: number = 0): void {
    if (this.allowKeyInput && !this.isMobile) {
      this.getInput(index).setSelectionRange(11, 11);
    }
  }

  public isInputEmpty(index: number = 0): boolean {
    const input = this.getInput(index);
    return !input || !input.value.trim();
  }

  public clearInput(index: number = 0, path = 'value'): void {
    this.getInput(index).value = '';
    set(this, path, null);
    this.cd.detectChanges();
    this.transmit();
  }

  public onInputFocus(index: number = 0): void {
    this.inputFocused[index] = true;
    if (this.allowKeyInput && !this.isMobile) {
      this.getInput(index).select();
    }
    this.openPicker(index);
  }

  public onInputBlur(index: number = 0): void {
    if (
      this.allowKeyInput &&
      !this.allowInputBlur &&
      !this.isMobile &&
      this.getPicker(index).opened
    ) {
      this.getInput(index).focus();
    } else {
      this.inputFocused[index] = false;
    }
    this.allowInputBlur = false;
  }

  public onInputKeydown(event: KeyboardEvent, index: number = 0): void {
    this.dtInputSrvc.filterAllowedKeys(event);

    if (isKey(event.key, Keys.enter) || isKey(event.key, Keys.escape)) {
      this.closePicker(index);
    }

    if (isKey(event.key, Keys.tab)) {
      const picker = this.getPicker(index);

      if (picker.opened && picker._popupRef) {
        event.preventDefault();
        this.allowInputBlur = true;

        (picker._popupRef.overlayElement.querySelector(
          '.mat-calendar-content td[tabindex="0"]'
        ) as HTMLElement).focus();
      }
    }
  }

  public onInputChange(event, index: number = 0): void {
    (event.target as HTMLInputElement).value = this.dtInputSrvc.parseDateInput(
      (event.target as HTMLInputElement).value
    );
  }

  public transmit(
    value = NaN,
    path = 'value',
    event = [InputEventType.onBlur]
  ) {
    if (value === value) {
      set(this, path, value);
    }

    this.transmitValue(this.value, {
      eventType: event,
      addToEventObj: { date: this.value }
    });
  }
}
