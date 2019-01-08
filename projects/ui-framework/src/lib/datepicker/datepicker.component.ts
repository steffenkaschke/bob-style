import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';
import {IconColor, Icons, IconSize} from '../icons';

@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<Date>> = new EventEmitter<MatDatepickerInputEvent<Date>>();
  @Input() inputPlaceholder: String;
  private readonly calendarIcon: String = Icons.calendar;
  private readonly calendarIconSize: String = IconSize.small;
  private readonly calendarIconColor: String = IconColor.dark;
  constructor() {
  }

  ngOnInit(): void {
  }


  public onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateChange.emit(event);
  }
}
