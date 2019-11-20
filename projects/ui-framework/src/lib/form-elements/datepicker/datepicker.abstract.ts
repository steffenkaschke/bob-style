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
  EventEmitter,
  HostBinding,
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
  cloneValue,
  isFalsyOrEmpty,
} from '../../services/utils/functional-utils';
import { dateOrFail } from '../../services/utils/transformers';
import { BDateAdapter } from './date.adapter';
import { MatDatepicker, MatDatepickerInput } from '@angular/material';
import { DateParseService } from './date-parse.service';
import { Keys } from '../../enums';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { throttle } from 'rxjs/operators';
import { WindowRef } from '../../services/utils/window-ref.service';
import { InputEventType, FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';
import { set } from 'lodash';
import { DatepickerType } from './datepicker.enum';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { Styles } from '../../services/html/html-helpers.interface';

export abstract class BaseDatepickerElement extends BaseFormElement
  implements OnInit, OnDestroy {
  constructor(
    protected windowRef: WindowRef,
    protected mobileService: MobileService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    protected dateParseSrvc: DateParseService
  ) {
    super(cd);
  }

  @ViewChild('inputWrap', { static: true }) inputWrap: ElementRef;
  @ViewChildren(MatDatepicker) public pickers: QueryList<MatDatepicker<any>>;
  @ViewChildren(MatDatepickerInput, { read: ElementRef })
  public inputs: QueryList<ElementRef>;

  @Input() id: string = simpleUID('bdp-');

  @Input() minDate: Date | string;
  @Input() maxDate: Date | string;
  @HostBinding('attr.data-type') @Input() type: DatepickerType =
    DatepickerType.date;

  @Input() allowKeyInput = true;
  @Input() dateFormat: string;
  @Input() panelClass: string;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public isMobile = false;
  public inputFocused: boolean[] = [];

  protected overlayStylesDef: Styles = {};

  private allowInputBlur = !this.allowKeyInput;
  private resizeSubscription: Subscription;
  private mediaEventSubscription: Subscription;
  private skipParse = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;
  readonly types = DatepickerType;

  private doneFirstChange = false;

  protected doOnPickerOpen(picker: MatDatepicker<any>): void {}

  ngOnInit(): void {
    if (!this.doneFirstChange) {
      this.ngOnChanges({});
    }

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

    if (this.value) {
      this.cd.detectChanges();
    }
    if (isFalsyOrEmpty(this.value, true)) {
      this.value = cloneValue(this.baseValue);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.mediaEventSubscription) {
      this.mediaEventSubscription.unsubscribe();
    }
  }

  // extends BaseFormElement's ngOnChanges
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

    this.doneFirstChange = true;
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

  protected getOverlayStyles(panelEl): Styles {
    if (this.inputWrap) {
      const overlayBox = this.inputWrap.nativeElement.getBoundingClientRect();
      const datePickerPanel = panelEl.querySelector('.b-datepicker-panel');
      const matCalBox =
        datePickerPanel && datePickerPanel.getBoundingClientRect();

      const alignedToRight =
        matCalBox &&
        matCalBox.width > overlayBox.width &&
        panelEl
          .querySelector('.mat-datepicker-content')
          .style.cssText.includes('right');

      const width = matCalBox
        ? Math.max(overlayBox.width, matCalBox.width)
        : overlayBox.width;

      return {
        ...this.overlayStylesDef,
        'pointer-events': 'none',
        width: width + 'px',
        left: !alignedToRight
          ? overlayBox.left + 'px'
          : overlayBox.left - (width - overlayBox.width) + 'px',
        right: 'auto',
      };
    }
    return {};
  }

  protected getPickerPanel(
    picker: MatDatepicker<any>
  ): { dialog: HTMLElement; popup: HTMLElement } {
    const panel = {
      dialog: null,
      popup: null,
    };

    // desktop
    if (picker._popupRef) {
      panel.popup = picker._popupRef.overlayElement;
    }
    // mobile
    if (
      (picker as any)._dialogRef &&
      (picker as any)._dialogRef._overlayRef &&
      (picker as any)._dialogRef._overlayRef.overlayElement
    ) {
      panel.dialog = (picker as any)._dialogRef._overlayRef.overlayElement.overlayElement;
    }

    return panel;
  }

  public getPickerPanelElements(
    picker: MatDatepicker<any>,
    selector: string
  ): HTMLElement[] {
    const panel = this.getPickerPanel(picker);
    if (!panel.popup && !panel.dialog) {
      return [];
    }
    const elements = (
      (!this.isMobile && panel.popup) ||
      (this.isMobile && panel.dialog)
    ).querySelectorAll(selector);
    return Array.from(elements) as HTMLElement[];
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

    this.zone.runOutsideAngular(() => {
      this.windowRef.nativeWindow.requestAnimationFrame(() => {
        const panel = this.getPickerPanel(picker);

        if (!this.isMobile && panel.popup) {
          this.DOM.setCssProps(panel.popup, this.getOverlayStyles(panel.popup));
        }

        if (this.isMobile && panel.dialog) {
          this.DOM.setCssProps(panel.dialog, this.overlayStylesDef);
        }
      });
    });

    this.doOnPickerOpen(picker);
  }

  public onPickerClose(index: number = 0): void {
    if (this.allowKeyInput && !this.isMobile) {
      this.getInput(index).setSelectionRange(11, 11);
    } else {
      this.getInput(index).blur();
    }
  }

  public onPickerMonthSelect(date: Date, index: number = 0): void {
    if (this.type === DatepickerType.month) {
      const picker = this.getPicker(index);
      this.allowInputBlur = true;
      picker.select(date);
      this.closePicker(picker);
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
    if (!this.isMobile) {
      this.openPicker(index);
    }
  }

  public onInputBlur(index: number = 0): void {
    const picker = this.getPicker(index);
    if (
      this.allowKeyInput &&
      !this.allowInputBlur &&
      !this.isMobile &&
      picker.opened
    ) {
      this.getInput(index).focus();
    } else if (!this.allowInputBlur || !picker.opened) {
      this.inputFocused[index] = false;
    }
    this.allowInputBlur = false;
  }

  public onInputKeydown(event: KeyboardEvent, index: number = 0): void {
    this.kbrdCntrlSrvc.filterAllowedKeys(event, /[0-9,\W]/i);

    if (isKey(event.key, Keys.backspace) || isKey(event.key, Keys.delete)) {
      this.skipParse = true;
    }

    if (isKey(event.key, Keys.enter) || isKey(event.key, Keys.escape)) {
      this.closePicker(index);
    }

    if (isKey(event.key, Keys.tab)) {
      const picker = this.getPicker(index);

      if (picker.opened && !this.isMobile) {
        event.preventDefault();
        this.allowInputBlur = true;

        const elToFocus = this.getPickerPanelElements(
          picker,
          '.mat-calendar-body td[tabindex="0"]'
        )[0];
        if (elToFocus) {
          elToFocus.focus();
        }
      }
    }
  }

  public onInputChange(event, index: number = 0): void {
    if (!this.skipParse) {
      (event.target as HTMLInputElement).value = this.dateParseSrvc.parseDateInput(
        (event.target as HTMLInputElement).value
      );
    }
    this.skipParse = false;
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
      addToEventObj: { date: this.value },
    });
  }
}
