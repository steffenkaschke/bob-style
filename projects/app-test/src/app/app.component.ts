import { Component, OnInit } from '@angular/core';
import { SelectGroupOption } from '../../../ui-framework/src/lib/form-elements/lists/list.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-test';

  rteControl = new FormControl();
  inputControl = new FormControl();

  ngOnInit() {
    this.rteControl.valueChanges.subscribe(value => {
      console.log('RTE valueChanges', value);
    });

    this.inputControl.valueChanges.subscribe(value => {
      console.log('INP valueChanges', value);
      this.rteControl.setValue(value, { emitEvent: false });
    });

    this.inputControl.setValue('why not?', { emitEvent: false });
    this.rteControl.setValue('why not?', { emitEvent: false });
  }
}
