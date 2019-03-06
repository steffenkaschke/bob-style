import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../date-range.interface';

@Component({
  selector: 'b-range-picker2',
  templateUrl: './range-picker2.component.html',
  styleUrls: ['./range-picker2.component.scss', '../datepickers.scss']
})
export class RangePicker2Component {

  hoveredDate1: NgbDate;

  fromDate: NgbDate = new NgbDate(2019, 3, 1);
  toDate: NgbDate;
  @Input() date: DateRange = null;
  @Output() dateSelected: EventEmitter<DateRange> = new EventEmitter<DateRange>();

  constructor(calendar: NgbCalendar) {
    // this.fromDate = calendar.getToday();
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
    return this.fromDate && !this.toDate && this.hoveredDate1 && date.after(this.fromDate) && date.before(this.hoveredDate1);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHoveredTo(date);
  }

  isRangeTo(date: NgbDate) {
    return false;
  }

  isHoveredTo(date: NgbDate) {
    return false;
  }


}
