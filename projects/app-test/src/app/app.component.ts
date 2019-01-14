import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-test';

  form: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
  });

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
  }

  validateFunc(value: string) {
    return function validateCounterRange(c: FormControl) {
      const err = {
        bobErr: {
          given: c.value,
        }
      };

      return (c.value !== value) ? err : null;
    };
  }
}
