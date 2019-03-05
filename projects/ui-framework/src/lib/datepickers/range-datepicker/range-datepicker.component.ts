import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

export interface DateRange {
  fromDate: NgbDate;
  toDate: NgbDate;
}

@Component({
  selector: 'b-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss']
})
export class RangeDatepickerComponent {

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  @Input() date: DateRange = null;
  @Output() dateSelected: EventEmitter<DateRange> = new EventEmitter<DateRange>();

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = null;
    if (this.date) {
      this.fromDate = this.date.fromDate;
      this.toDate = this.date.toDate;
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.dateSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

}
