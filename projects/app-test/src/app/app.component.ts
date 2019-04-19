import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-test';

  rteControl = new FormControl();
  // { value: null },
  // { updateOn: 'blur' }
  inputControl = new FormControl();
  disabled = false;
  error = false;

  ngOnInit() {
    this.rteControl.valueChanges.subscribe(value => {
      console.log('RTE valueChanges', value);
    });

    this.inputControl.valueChanges.subscribe(value => {
      console.log('INP valueChanges', value);
      this.rteControl.setValue(value, {
        // emitEvent: false
      });
    });

    this.inputControl.setValue('i am input', {
      emitEvent: false
    });
    this.rteControl.setValue('i am rte', {
      emitEvent: false
    });
  }
}
