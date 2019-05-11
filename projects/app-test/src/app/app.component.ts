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

  placeholderList = [
    {
      groupName: 'Basic Info - header',
      options: [
        {
          id: '/work/title',
          selected: false,
          value: 'work | title'
        },
        {
          id: '/root/firstName',
          selected: false,
          value: 'First name'
        }
      ]
    }
  ];

  myForm = new FormGroup({
    rteControl: new FormControl('', {
      updateOn: 'blur'
    }),
    inputControl: new FormControl('', {
      updateOn: 'blur'
    })
  });

  rteInitValue = `<div>Hello <a href="http://www.google.com">World</a>!</div>
  <div>Some <em>initial</em> <strong>bold</strong> text</div>
  {{/root/firstName}}`;

  togglePlaceholders() {
    this.plchldrs = !this.plchldrs;
  }

  onRTEevent(event, type) {
    console.log('*** RTE ' + type + ': "' + event + '"');
  }

  ngOnInit() {
    this.myForm.get('rteControl').valueChanges.subscribe(value => {
      console.log('!!!!!!! RTE valueChanges: "' + value + '"');
    });

    this.myForm.get('inputControl').valueChanges.subscribe(value => {
      console.log('!!!!!!! INP valueChanges', value);
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
