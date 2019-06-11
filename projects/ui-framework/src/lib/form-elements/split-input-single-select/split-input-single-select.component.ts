import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  forwardRef,
  ElementRef
} from '@angular/core';
import { SelectGroupOption } from '../lists/list.interface';
import { InputTypes } from '../input/input.enum';
import { InputEventType } from '../form-elements.enum';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { assign, has, map } from 'lodash';
import { InputEvent } from '../input/input.interface';
import { ListChange } from '../lists/list-change/list-change';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { FormEvents } from '../form-elements.enum';

@Component({
  selector: 'b-split-input-single-select',
  templateUrl: './split-input-single-select.component.html',
  styleUrls: ['./split-input-single-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true
    }
  ]
})
export class SplitInputSingleSelectComponent extends BaseFormElement
  implements OnChanges {
  constructor(public host: ElementRef) {
    super(host);
    this.inputTransformers = [
      value => (value ? assign({}, this.baseValue, value) : this.baseValue)
    ];
    this.wrapEvent = false;
  }

  readonly baseValue: InputSingleSelectValue = {
    inputValue: null,
    selectValue: null
  };

  @Input() value: InputSingleSelectValue = this.baseValue;
  @Input() inputType: InputTypes;
  @Input() selectOptions: SelectGroupOption[];

  public options: SelectGroupOption[] = [];

  @Output(FormEvents.elementChange) changed: EventEmitter<
    InputSingleSelectValue
  > = new EventEmitter<InputSingleSelectValue>();

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.selectOptions) {
      this.selectOptions = changes.selectOptions.currentValue;
      this.options = this.enrichOptionsWithSelection(this.selectOptions);
    }
  }

  private enrichOptionsWithSelection(
    options: SelectGroupOption[]
  ): SelectGroupOption[] {
    return !this.value
      ? []
      : map(options, g =>
          assign({}, g, {
            options: map(g.options, o =>
              assign({}, o, { selected: o.id === this.value.selectValue })
            )
          })
        );
  }

  onInputChange(event: InputEvent): void {
    if (
      event.event === InputEventType.onChange ||
      event.event === InputEventType.onBlur
    ) {
      this.value.inputValue = event.value;
      this.transmitValue(this.value, { eventType: [event.event] });
    }
  }

  onSelectChange(listChange: ListChange): void {
    this.value.selectValue = listChange.getSelectedIds()[0];

    this.transmitValue(this.value, {
      eventType: [InputEventType.onChange, InputEventType.onBlur]
    });
  }
}
