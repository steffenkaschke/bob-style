import { Component } from '@angular/core';
import { SelectGroupOption } from '../../../ui-framework/src/lib/form-elements/lists/list.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-test';
  chipType = 'success';
  chipColor = null;

  toggleDisabled() {
    this.chipType = this.chipType === 'disabled' ? 'success' : 'disabled';
  }
  toggleRed() {
    this.chipColor = this.chipColor === 'red' ? null : 'red';
  }
}
