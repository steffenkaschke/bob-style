import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss', '../datepickers.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() date: NgbDate = null;
  @Output() dateSelected: EventEmitter<NgbDate> = new EventEmitter<NgbDate>();

  constructor() {
  }

  ngOnInit() {
    // this.date = new NgbDate(2019, 3, 1);
  }

  onDateSelect(date) {
    this.dateSelected.emit(date);
  }

  isDate(date: NgbDate) {
    if (!this.date) { return false; }
    return this.date.day === date.day &&
      this.date.month === date.month &&
      this.date.year === date.year;
  }

}
