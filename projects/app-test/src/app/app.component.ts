import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  disabled = false;
  error = false;
  plchldrs = true;
  lines = 2;

  myForm = new FormGroup({
    rteControl: new FormControl('', {
      updateOn: 'blur'
    }),
    inputControl: new FormControl('', {
      updateOn: 'blur'
    })
  });

  rteInitValue = `<div>Hello <a href="http://www.google.com">World</a>!</div><div>Some initial <strong>bold</strong> text</div> {{/root/firstName}}`;

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
    this.myForm.get('rteControl').setValue(this.rteInitValue, {
      emitEvent: false
    });
  }
}
