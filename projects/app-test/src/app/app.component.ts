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

  rteControl = new FormControl('Test');
  checkControl = new FormControl(true);
  inputControl = new FormControl('blah');

  ngOnInit() {
    this.rteControl.valueChanges.subscribe(value => {
      console.log('valueChanges', value);
    });

    this.inputControl.valueChanges.subscribe(value => {
      this.rteControl.setValue(value);
    });
  }
}
