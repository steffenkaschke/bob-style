import { Component } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-test';

  date: NgbDate = new NgbDate(2019, 3, 11);

  onSelectDate(date) {
    console.log(date);
  }
}
