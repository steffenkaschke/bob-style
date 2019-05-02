import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { chipOptionsMock } from '../../../ui-framework/src/lib/buttons-indicators/chips/chip-input/chipsOptionsMock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Chips Input

  allChips = chipOptionsMock;

  // RTE

  disabled = false;
  error = false;
  lines = 2;

  myForm = new FormGroup({
    rteControl: new FormControl('', {
      updateOn: 'blur'
    }),
    inputControl: new FormControl('', {
      updateOn: 'blur'
    })
  });

  ngOnInit() {
    this.myForm.get('rteControl').valueChanges.subscribe(value => {
      console.log('RTE valueChanges', value);
    });

    this.myForm.get('inputControl').valueChanges.subscribe(value => {
      console.log('INP valueChanges', value);
      this.myForm.get('rteControl').setValue(value);
    });

    this.myForm.get('inputControl').setValue('i am input', {
      emitEvent: false
    });
    this.myForm.get('rteControl').setValue('i am rte', {
      emitEvent: false
    });
  }
}
