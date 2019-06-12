import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  forwardRef
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
import {
  objectOrFail,
  setDefaultIfUndefined
} from '../../services/utils/transformers';

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
  constructor() {
    super();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      // this.value = assign(this.baseValue, changes.value.currentValue);
      // console.log('ngOnChanges value', this.value);
    }
    if (changes.selectOptions) {
      this.selectOptions = changes.selectOptions.currentValue;
    }
    if (changes.value || changes.selectOptions) {
      this.options = this.enrichOptionsWithSelection(this.selectOptions);
    }
  }

  private enrichOptionsWithSelection(
    options: SelectGroupOption[]
  ): SelectGroupOption[] {
    return map(options, g =>
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
