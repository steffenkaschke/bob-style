import { Component, OnInit } from '@angular/core';
import { SelectGroupOption } from '../../../ui-framework/src/lib/form-elements/lists/list.interface';
import { FormControl } from '@angular/forms';
import { RTEControls } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rich-text-editor.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-test';

  rteControl = new FormControl();
  inputControl = new FormControl();
  private allControls = Object.values(RTEControls);
  controls = this.allControls;

  randomizeRTEcontrols() {
    this.controls = this.allControls
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * this.allControls.length) + 1);
  }

  ngOnInit() {
    this.randomizeRTEcontrols();

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
