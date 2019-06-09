import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { chipOptionsMock } from '../../../../ui-framework/src/lib/form-elements/chip-input/chip-input.mock';
import {
  isString,
  isArray
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';

@Component({
  selector: 'app-form-elements-test',
  templateUrl: './form-elements.component.html',
  styleUrls: ['./form-elements.component.scss']
})
export class FormElementsTestComponent implements OnInit, OnDestroy {
  constructor() {}

  public json = JSON;

  isArray = isArray;

  allFormElements = [
    'bInput',
    'bTextarea',
    'bDatepicker',
    'bChipinput',
    'bSocial',
    'bCheckbox',
    'bRadio'
    // 'bSplitInput'
  ];

  globalEnableFormControl = true;
  globalEnableDirectInput = false;

  globalFormControlStartValues = {
    null: null,
    empty: '',
    undefined: undefined,
    string: 'Some value',
    number: 123,
    true: true,
    false: false,
    array: ['a', 'b', 'c'],
    object: { a: 'a', b: 'b', c: 'c' }
  };
  globalFormControlStartValue = this.globalFormControlStartValues.null;

  global_warn = false;
  global_warn_value = 'Warning message';
  global_error = false;
  global_error_value = 'Error message';

  ///////////////////////////////////

  bInput_SubscrValue;
  bInput_EventValue;
  bInput_SubscrCounter = 0;
  bInput_EventCounter = 0;
  bInput_label = 'Input label';
  bInput_placeholder = 'Input placeholder';
  bInput_value = 'Input value';
  bInput_disabled = false;
  bInput_required = true;
  bInput_hint = 'Input hint text';
  bInput_warn = this.global_warn ? this.global_warn_value : '';
  bInput_error = this.global_error ? this.global_error_value : '';
  bInput_setValEmit = true;
  bInput_updateOn_mode = 'change';
  bInput_subscribtion;
  bInput_formControlEnabled = this.globalEnableFormControl;
  bInput_directValueInput = this.globalEnableDirectInput;

  bInput_Form = new FormGroup({
    bInput: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bInput_updateOn_mode as any
    })
  });
  bInput = this.bInput_Form.get('bInput');

  ///////////////////////////////////

  bTextarea_SubscrValue;
  bTextarea_EventValue;
  bTextarea_SubscrCounter = 0;
  bTextarea_EventCounter = 0;
  bTextarea_label = 'Textarea label';
  bTextarea_placeholder = 'Textarea placeholder';
  bTextarea_value = 'Textarea value';
  bTextarea_disabled = false;
  bTextarea_required = true;
  bTextarea_hint = 'Textarea hint text';
  bTextarea_warn = this.global_warn ? this.global_warn_value : '';
  bTextarea_error = this.global_error ? this.global_error_value : '';
  bTextarea_setValEmit = true;
  bTextarea_updateOn_mode = 'change';
  bTextarea_subscribtion;
  bTextarea_formControlEnabled = this.globalEnableFormControl;
  bTextarea_directValueInput = this.globalEnableDirectInput;

  bTextarea_Form = new FormGroup({
    bTextarea: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bTextarea_updateOn_mode as any
    })
  });
  bTextarea = this.bTextarea_Form.get('bTextarea');

  ///////////////////////////////////

  bDatepicker_SubscrValue;
  bDatepicker_EventValue;
  bDatepicker_SubscrCounter = 0;
  bDatepicker_EventCounter = 0;
  bDatepicker_label = 'Datepicker label';
  bDatepicker_placeholder = 'Date placeholder';
  bDatepicker_value = '02/01/2013';
  bDatepicker_dateFormat = '';
  bDatepicker_disabled = false;
  bDatepicker_required = true;
  bDatepicker_hint = 'Datepicker hint text';
  bDatepicker_warn = this.global_warn ? this.global_warn_value : '';
  bDatepicker_error = this.global_error ? this.global_error_value : '';
  bDatepicker_setValEmit = true;
  bDatepicker_updateOn_mode = 'change';
  bDatepicker_subscribtion;
  bDatepicker_formControlEnabled = this.globalEnableFormControl;
  bDatepicker_directValueInput = this.globalEnableDirectInput;

  bDatepicker_Form = new FormGroup({
    bDatepicker: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bDatepicker_updateOn_mode as any
    })
  });
  bDatepicker = this.bDatepicker_Form.get('bDatepicker');

  ///////////////////////////////////

  bChipinput_SubscrValue;
  bChipinput_EventValue;
  bChipinput_SubscrCounter = 0;
  bChipinput_EventCounter = 0;
  bChipinput_label = 'Chip Input label';
  bChipinput_placeholder = 'Chip Input placeholder';
  bChipinput_value = 'petting, fisting, rimming';
  bChipinput_options = chipOptionsMock;
  bChipinput_acceptNew = true;
  bChipinput_disabled = false;
  bChipinput_required = true;
  bChipinput_hint = 'Chip Input hint text';
  bChipinput_warn = this.global_warn ? this.global_warn_value : '';
  bChipinput_error = this.global_error ? this.global_error_value : '';
  bChipinput_setValEmit = true;
  bChipinput_updateOn_mode = 'change';
  bChipinput_subscribtion;
  bChipinput_formControlEnabled = this.globalEnableFormControl;
  bChipinput_directValueInput = this.globalEnableDirectInput;

  bChipinput_Form = new FormGroup({
    bChipinput: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bChipinput_updateOn_mode as any
    })
  });
  bChipinput = this.bChipinput_Form.get('bChipinput');

  ///////////////////////////////////

  bSocial_SubscrValue;
  bSocial_EventValue;
  bSocial_SubscrCounter = 0;
  bSocial_EventCounter = 0;
  bSocial_type = 'facebook';
  bSocial_label = 'Social Input label';
  bSocial_placeholder = 'Your Name';
  bSocial_value = 'Social Input value';
  bSocial_disabled = false;
  bSocial_required = true;
  bSocial_hint = 'Social Input hint text';
  bSocial_warn = this.global_warn ? this.global_warn_value : '';
  bSocial_error = this.global_error ? this.global_error_value : '';
  bSocial_setValEmit = true;
  bSocial_updateOn_mode = 'change';
  bSocial_subscribtion;
  bSocial_formControlEnabled = this.globalEnableFormControl;
  bSocial_directValueInput = this.globalEnableDirectInput;

  bSocial_Form = new FormGroup({
    bSocial: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bSocial_updateOn_mode as any
    })
  });
  bSocial = this.bSocial_Form.get('bSocial');

  ///////////////////////////////////

  bCheckbox_SubscrValue;
  bCheckbox_EventValue;
  bCheckbox_SubscrCounter = 0;
  bCheckbox_EventCounter = 0;
  bCheckbox_label = 'Checkbox label';
  bCheckbox_placeholder = 'Checkbox Placeholder';
  bCheckbox_value = 'true';
  bCheckbox_indeterminate = false;
  bCheckbox_disabled = false;
  bCheckbox_required = true;
  bCheckbox_hint = 'Checkbox hint';
  bCheckbox_warn = this.global_warn ? this.global_warn_value : '';
  bCheckbox_error = this.global_error ? this.global_error_value : '';
  bCheckbox_setValEmit = true;
  bCheckbox_updateOn_mode = 'change';
  bCheckbox_subscribtion;
  bCheckbox_formControlEnabled = this.globalEnableFormControl;
  bCheckbox_directValueInput = this.globalEnableDirectInput;

  bCheckbox_Form = new FormGroup({
    bCheckbox: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bCheckbox_updateOn_mode as any
    })
  });
  bCheckbox = this.bCheckbox_Form.get('bCheckbox');

  ///////////////////////////////////

  bRadio_SubscrValue;
  bRadio_EventValue;
  bRadio_SubscrCounter = 0;
  bRadio_EventCounter = 0;

  bRadio_label = 'Radio button label';
  bRadio_value = 'Option one';

  bRadio_options = ['Option one', 'Option two', 'Option three'];
  bRadio_direction = 'row';

  bRadio_disabled = false;
  bRadio_required = true;
  bRadio_hint = 'Radio hint';
  bRadio_warn = this.global_warn ? this.global_warn_value : '';
  bRadio_error = this.global_error ? this.global_error_value : '';
  bRadio_setValEmit = true;
  bRadio_updateOn_mode = 'change';
  bRadio_subscribtion;
  bRadio_formControlEnabled = this.globalEnableFormControl;
  bRadio_directValueInput = this.globalEnableDirectInput;

  bRadio_Form = new FormGroup({
    bRadio: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bRadio_updateOn_mode as any
    })
  });
  bRadio = this.bRadio_Form.get('bRadio');

  ///////////////////////////////////

  currencies = [
    { value: 'AED', serverId: null },
    { value: 'ANG', serverId: null },
    { value: 'AUD', serverId: null },
    { value: 'AZN', serverId: null },
    { value: 'BAM', serverId: null },
    { value: 'BGN', serverId: null },
    { value: 'BRL', serverId: null },
    { value: 'BTC', serverId: null },
    { value: 'BWP', serverId: null },
    { value: 'CAD', serverId: null },
    { value: 'CHF', serverId: null },
    { value: 'CLP', serverId: null },
    { value: 'CNY', serverId: null },
    { value: 'COP', serverId: null },
    { value: 'CZK', serverId: null },
    { value: 'DKK', serverId: null },
    { value: 'EGP', serverId: null },
    { value: 'EUR', serverId: null },
    { value: 'GBP', serverId: null },
    { value: 'HKD', serverId: null },
    { value: 'HUF', serverId: null },
    { value: 'IDR', serverId: null },
    { value: 'ILS', serverId: null },
    { value: 'INR', serverId: null },
    { value: 'JPY', serverId: null },
    { value: 'KES', serverId: null },
    { value: 'KRW', serverId: null },
    { value: 'MAD', serverId: null },
    { value: 'MMK', serverId: null },
    { value: 'MXN', serverId: null },
    { value: 'MYR', serverId: null },
    { value: 'NGN', serverId: null },
    { value: 'NOK', serverId: null },
    { value: 'NPR', serverId: null },
    { value: 'NZD', serverId: null },
    { value: 'PEN', serverId: null },
    { value: 'PHP', serverId: null },
    { value: 'PLN', serverId: null },
    { value: 'RON', serverId: null },
    { value: 'RUB', serverId: null },
    { value: 'SEK', serverId: null },
    { value: 'SGD', serverId: null },
    { value: 'THB', serverId: null },
    { value: 'TRY', serverId: null },
    { value: 'TWD', serverId: null },
    { value: 'TZS', serverId: null },
    { value: 'UAH', serverId: null },
    { value: 'USD', serverId: null },
    { value: 'UYU', serverId: null },
    { value: 'VND', serverId: null },
    { value: 'XOF', serverId: null },
    { value: 'ZAR', serverId: null }
  ];

  optionsMock = Array.from(Array(1), (_, i) => {
    return {
      groupName: 'all currencies',
      options: this.currencies.map(currency => ({
        value: currency.value,
        id: currency.value,
        selected: null
      }))
    };
  });

  bSplitInput_SubscrValue;
  bSplitInput_EventValue;
  bSplitInput_SubscrCounter = 0;
  bSplitInput_EventCounter = 0;
  bSplitInput_label = 'Input label';
  bSplitInput_placeholder = 'Input placeholder';
  bSplitInput_value = {
    inputValue: 100,
    selectValue: 'AED'
  };
  bSplitInput_selectOptions = this.optionsMock;
  bSplitInput_disabled = false;
  bSplitInput_required = true;
  bSplitInput_hint = 'Input hint text';
  bSplitInput_warn = this.global_warn ? this.global_warn_value : '';
  bSplitInput_error = this.global_error ? this.global_error_value : '';
  bSplitInput_setValEmit = true;
  bSplitInput_updateOn_mode = 'change';
  bSplitInput_subscribtion;
  bSplitInput_formControlEnabled = this.globalEnableFormControl;
  bSplitInput_directValueInput = this.globalEnableDirectInput;

  bSplitInput_Form = new FormGroup({
    bSplitInput: new FormControl(this.globalFormControlStartValue, {
      updateOn: this.bSplitInput_updateOn_mode as any
    })
  });
  bSplitInput = this.bSplitInput_Form.get('bSplitInput');

  ///////////////////////////////////

  setValue(name) {
    if (this[name]) {
      this[name].setValue(this[name + '_value'], {
        emitEvent: this[name + '_setValEmit']
      });
    }
  }

  onEvent(name, $event) {
    if (!isString($event)) {
      $event = JSON.stringify($event);
    }

    this[name + '_EventValue'] =
      (this[name + '_EventValue']
        ? this[name + '_EventValue'].split('|').slice(-1) + ' | '
        : '') + $event;
    this[name + '_EventCounter']++;
  }

  subscribeToValueChanges(name) {
    this[name + '_subscribtion'] =
      this[name] &&
      this[name].valueChanges.subscribe(value => {
        this[name + '_SubscrValue'] = value;
        this[name + '_SubscrCounter']++;
      });
  }

  unSubscribeFromValueChanges(name) {
    this[name + '_subscribtion'].unsubscribe();
  }

  subscribeToAll(names) {
    names.forEach(name => {
      this.subscribeToValueChanges(name);
    });
  }

  unSubscribeFromAll(names) {
    names.forEach(name => {
      this.unSubscribeFromValueChanges(name);
    });
  }

  setUpdateOnMode(name, mode) {
    const value = this[name + '_Form'].get(name).value;
    const newControl = new FormControl(value, {
      updateOn: mode
    });
    this[name + '_Form'].setControl(name, newControl);
    this[name] = this[name + '_Form'].get(name);
    this.unSubscribeFromValueChanges(name);
    this.subscribeToValueChanges(name);
  }

  globalControlChange(control) {
    let value = '';
    if (this[control]) {
      value = this[control + '_value'];
    }
    this.allFormElements.forEach(name => {
      this[name + '_' + control.split('_')[1]] = value;
    });
  }

  setGlobalFormControlValue(event) {
    const val = this.globalFormControlStartValues[event.target.value];

    this.globalFormControlStartValue = val;

    this.allFormElements.forEach(name => {
      this[name + '_value'] = val;
      this.setValue(name);
    });
  }

  onSubmit(event, name) {
    console.log('------------------------');
    console.log(name + ' form submitted.');
    console.log(this[name + '_Form'].value);
  }

  onSubmitClick(name) {
    const form = document.querySelector(
      'section.' + name + ' form'
    ) as HTMLFormElement;

    let submitButton = document.querySelector(
      'section.' + name + ' .hidden-submit'
    ) as HTMLElement;

    if (!submitButton) {
      submitButton = document.createElement('button');
      (submitButton as any).type = 'submit';
      submitButton.id = 'hidden-submit-' + name;
      submitButton.className = 'hidden-submit';
      submitButton.style.opacity = '0';
      submitButton.style.position = 'absolute';
      submitButton.style.border = '0';
      submitButton.style.padding = '0';
      submitButton.style.overflow = 'hidden';
      submitButton.style.width = '1px';
      submitButton.style.height = '1px';
      submitButton.style.clip = 'rect(0 0 0 0)';
      submitButton.style.margin = '-1px';
      submitButton = form.appendChild(submitButton) as HTMLElement;
    }

    submitButton.click();
  }

  logEvent(event) {
    console.log(event);
  }

  type(smth) {
    let thisType = String(typeof smth);
    if (thisType === 'object' && isArray(smth)) {
      thisType = 'array';
    }
    return thisType;
  }

  ///////////////////////////////////

  ngOnInit() {
    this.subscribeToAll(this.allFormElements);
  }

  ngOnDestroy() {
    this.unSubscribeFromAll(this.allFormElements);
  }
}
