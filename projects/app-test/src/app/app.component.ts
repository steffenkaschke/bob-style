import { Component, OnInit, ViewChild, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { chipOptionsMock } from '../../../ui-framework/src/lib/buttons-indicators/chips/chip-input/chip-input.mock';

import { RichTextEditorComponent } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rte.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {}

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
  bInput_warn = '';
  bInput_error = '';
  bInput_setValEmit = true;
  bInput_updateOn = { blur: false };
  bInput_subscribtion;

  bInput_Form = new FormGroup({
    bInput: new FormControl(null, {
      updateOn: this.bInput_updateOn.blur ? 'blur' : 'change'
    })
  });
  bInput = this.bInput_Form.get('bInput');

  ///////////////////////////////////

  bTextarea_SubscrValue;
  bTextarea_EventValue;
  bTextarea_SubscrCounter = 0;
  bTextarea_EventCounter = 0;
  bTextarea_label = 'Input label';
  bTextarea_placeholder = 'Input placeholder';
  bTextarea_value = 'Input value';
  bTextarea_disabled = false;
  bTextarea_required = true;
  bTextarea_hint = 'Input hint text';
  bTextarea_warn = '';
  bTextarea_error = '';
  bTextarea_setValEmit = true;
  bTextarea_updateOn = { blur: false };
  bTextarea_subscribtion;

  bTextarea_Form = new FormGroup({
    bTextarea: new FormControl(null, {
      updateOn: this.bTextarea_updateOn.blur ? 'blur' : 'change'
    })
  });
  bTextarea = this.bTextarea_Form.get('bTextarea');

  ///////////////////////////////////

  bDatepicker_SubscrValue;
  bDatepicker_EventValue;
  bDatepicker_SubscrCounter = 0;
  bDatepicker_EventCounter = 0;
  bDatepicker_label = 'Input label';
  bDatepicker_placeholder = 'Input placeholder';
  bDatepicker_value = 'Input value';
  bDatepicker_disabled = false;
  bDatepicker_required = true;
  bDatepicker_hint = 'Input hint text';
  bDatepicker_warn = '';
  bDatepicker_error = '';
  bDatepicker_setValEmit = true;
  bDatepicker_updateOn = { blur: false };
  bDatepicker_subscribtion;

  bDatepicker_Form = new FormGroup({
    bDatepicker: new FormControl(null, {
      updateOn: this.bDatepicker_updateOn.blur ? 'blur' : 'change'
    })
  });
  bDatepicker = this.bDatepicker_Form.get('bDatepicker');

  ///////////////////////////////////

  bChipinput_SubscrValue;
  bChipinput_EventValue;
  bChipinput_SubscrCounter = 0;
  bChipinput_EventCounter = 0;
  bChipinput_label = 'Input label';
  bChipinput_placeholder = 'Input placeholder';
  bChipinput_value = [];
  bChipinput_options = chipOptionsMock;
  bChipinput_acceptNew = true;
  bChipinput_disabled = false;
  bChipinput_required = true;
  bChipinput_hint = 'Input hint text';
  bChipinput_warn = '';
  bChipinput_error = '';
  bChipinput_setValEmit = true;
  bChipinput_updateOn = { blur: false };
  bChipinput_subscribtion;

  bChipinput_Form = new FormGroup({
    bChipinput: new FormControl([], {
      updateOn: this.bChipinput_updateOn.blur ? 'blur' : 'change'
    })
  });
  bChipinput = this.bChipinput_Form.get('bChipinput');

  ///////////////////////////////////

  setValue(name) {
    this[name].setValue(this[name + '_value'], {
      emitEvent: this[name + '_setValEmit']
    });
  }

  onEvent(name, $event) {
    this[name + '_EventValue'] = JSON.stringify($event);
    this[name + '_EventCounter']++;
  }

  subscribeTovalueChanges(name) {
    this[name + '_subscribtion'] = this[name].valueChanges.subscribe(value => {
      this[name + '_SubscrValue'] = value;
      this[name + '_SubscrCounter']++;
    });
  }

  toggleUpdateOnMode(name) {
    let mode;
    if (this[name + '_updateOn'].blur) {
      mode = 'change';
    } else {
      mode = 'blur';
    }
    this[name + '_updateOn'].blur = !this[name + '_updateOn'].blur;

    const value = this[name + '_Form'].get(name).value;
    const newControl = new FormControl(value, {
      updateOn: mode
    });
    this[name + '_Form'].setControl(name, newControl);
    this[name] = this[name + '_Form'].get(name);
    this[name + '_subscribtion'].unsubscribe();
    this.subscribeTovalueChanges(name);
  }

  ///////////////////////////////////

  ngOnInit() {
    this.subscribeTovalueChanges('bInput');
    this.subscribeTovalueChanges('bTextarea');
    this.subscribeTovalueChanges('bDatepicker');
    this.subscribeTovalueChanges('bChipinput');
  }

  ///////////////////////////////////

  // @ViewChild('rteEditor') private rteEditor: RichTextEditorComponent;

  // // Chips Input

  // allChips = chipOptionsMock;

  // myForm2 = new FormGroup({
  //   chipsControl: new FormControl([], {
  //     updateOn: 'blur'
  //   })
  // });

  // // RTE

  // disabled = false;
  // error = false;
  // plchldrs = true;
  // lines = 2;

  // placeholderList = [
  //   {
  //     groupName: 'Basic Info - header',
  //     options: [
  //       {
  //         displayName: 'First name',
  //         id: '/root/firstName',
  //         value: 'First name'
  //       },
  //       {
  //         displayName: 'title',
  //         id: '/work/title',
  //         category: 'Work',
  //         value: 'title'
  //       }
  //     ]
  //   }
  // ];

  // myForm = new FormGroup({
  //   rteControl: new FormControl('', {
  //     updateOn: 'blur'
  //   }),
  //   inputControl: new FormControl('', {
  //     updateOn: 'blur'
  //   })
  // });

  // rteInitValue = `<div>Hello <a href="http://www.google.com">World</a> and suck dicks!</div>
  // <div>Some <em>initial</em> <strong>bold</strong> text</div>
  // {{/root/firstName}}`;

  // togglePlaceholders() {
  //   this.plchldrs = !this.plchldrs;
  // }

  // onRTEevent(event, type) {
  //   console.log('*** RTE ' + type + ': "' + event + '"');
  // }

  // onRteFormSubmit() {
  //   console.log(this.myForm.value);
  // }

  // ngOnInit() {
  //   this.myForm.get('rteControl').valueChanges.subscribe(value => {
  //     console.log('!!!!!!! RTE valueChanges: "' + value + '"');
  //   });

  //   this.myForm.get('inputControl').valueChanges.subscribe(value => {
  //     console.log('!!!!!!! INP valueChanges', value);
  //     this.myForm.get('rteControl').setValue(value);
  //   });

  //   this.myForm.get('inputControl').setValue('i am input', {
  //     emitEvent: false
  //   });
  //   this.myForm.get('rteControl').setValue('i am rte', {
  //     emitEvent: false
  //   });

  //   setTimeout(() => {
  //     this.rteEditor.ngOnChanges({
  //       value: new SimpleChange(null, this.rteInitValue, false)
  //     });
  //     this.rteEditor.editor.root.dispatchEvent(new Event('blur'));
  //   }, 1000);

  //   // chips

  //   this.myForm2.get('chipsControl').valueChanges.subscribe(value => {
  //     console.log('>>> CHIPS valueChanges: "' + value + '"');
  //   });
  //   this.myForm2.get('chipsControl').setValue(['petting', 'rimming'], {
  //     emitEvent: false
  //   });
  // }
}
