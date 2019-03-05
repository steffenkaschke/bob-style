import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() date: NgbDate = null;
  @Output() dateSelected: EventEmitter<NgbDate> = new EventEmitter<NgbDate>();

  constructor() {
  }

  ngOnInit() {
  }

  onDateSelect(date) {
    this.dateSelected.emit(date);
  }

}
