import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<Date>> = new EventEmitter<MatDatepickerInputEvent<Date>>();
  constructor() {
  }

  ngOnInit(): void {
  }


  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateChange.emit(event);
  }
}
