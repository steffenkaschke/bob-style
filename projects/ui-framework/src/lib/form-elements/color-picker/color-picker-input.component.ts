import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BaseFormElement,
  DOMhelpers, DOMInputEvent,
  InputTypes,
  isNullOrUndefined,
  isNumber,
  isRegExp,
  valueAsNumber,
} from 'bob-style';
import { BaseInputElement } from '../base-input-element';
import { FormElementKeyboardCntrlService, InputCursorState } from '../services/keyboard-cntrl.service';


@Component({
  selector: 'b-color-picker-input',
  templateUrl: './color-picker-input.component.html',
  styleUrls: ['./color-picker-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorPickerInputComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: ColorPickerInputComponent },
  ],
})
export class ColorPickerInputComponent extends BaseInputElement implements AfterViewInit {
  constructor(
    cd: ChangeDetectorRef,
    zone: NgZone,
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private DOM: DOMhelpers
  ) {
    super(cd, zone);

    this.inputTransformers.push(
      (value) =>
        valueAsNumber(this.inputType, value, undefined, this.decimals || 4),

      (value) => {
        return this.inputType === InputTypes.number &&
        this.onlyIntegers &&
        isNumber(value)
          ? Math.round(value)
          : value;
      }
    );
    this.outputTransformers.push((value) =>
      valueAsNumber(this.inputType, value, 0, this.decimals || 4)
    );

    this.forceElementValue = (value: number | string): string => {
      return isNullOrUndefined(value) || value === ''
        ? ''
        : value as string
    };
  }

  @Input() numberFormat = false;
  @Input() onlyIntegers = false;
  @Input() decimals = 4;

  @Input('allowedChars') set setAllowedKeys(allowedKeys: string | RegExp) {
    this.allowedKeys = !allowedKeys
      ? null
      : isRegExp(allowedKeys)
        ? allowedKeys
        : new RegExp(`[${allowedKeys}]`.replace(/([\[\]]){2,}/g, '$1'));
  }
  private allowedKeys: RegExp;

  private lastCursorState: InputCursorState = null;

  private numberDisplayFormatter: Intl.NumberFormat;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (this.allowedKeys) {
      this.kbrdCntrlSrvc.filterAllowedKeys(event, this.allowedKeys);
    }

    super.onInputKeydown(event);
  }

  public onInputChange(event: DOMInputEvent): void {
    if (this.inputType !== InputTypes.number || !this.numberFormat) {
      console.log('input change done');
      super.onInputChange(event);
      return;
    }

    if (event.data !== '.' && event.data !== '0') {
      super.onInputChange(event);

      if (this.lastCursorState !== null) {
        const input = this.input.nativeElement;
        this.kbrdCntrlSrvc.setCursorAtIndex(
          input,
          this.lastCursorState.selectionStart +
          (input.value.length - this.lastCursorState.valueLength) +
          this.lastCursorState.positionMod
        );
        this.lastCursorState = null;
      }
    } else {
      super.onInputChange(event, false);
    }
  }

  public onInputBlur(event: FocusEvent = null) {
    const relatedTarget = event.relatedTarget as HTMLButtonElement;

    if (
      this.inputType !== InputTypes.number ||
      !relatedTarget ||
      (relatedTarget && !relatedTarget.classList.contains('step-button'))
    ) {
      console.log('event: ', event);
      super.onInputBlur(event);
    }
  }

  public onColorPickerChange(color) {
    this.value = color;
    super.onInputBlur(null);
  }
}
