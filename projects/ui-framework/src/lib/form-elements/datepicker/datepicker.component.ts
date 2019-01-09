import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material';
import {IconColor, Icons, IconSize} from '../../icons';
import * as moment from 'moment';
import {InputEvent, InputEventType, InputTypes} from '../input/input.enum';


@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {

  @Output() dateChange: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();
  @Input() inputPlaceholder: String;

  private readonly calendarIcon: String = Icons.calendar;
  private readonly calendarIconSize: String = IconSize.small;
  private readonly calendarIconColor: String = IconColor.dark;

  inputTypes = InputTypes;

  constructor() {
  }

  ngOnInit(): void {
  }

  inputEvents(inputEvent: InputEvent, picker: MatDatepicker<any>): void {
    switch (inputEvent.event) {
      case InputEventType.onBlur:
        break;
      case InputEventType.onChange:
        this.dateChange.emit(inputEvent);
        break;
      case InputEventType.onFocus:
        picker.open();
        break;
    }
  }

  public dateClass(d: Date): string {
    const today = moment(new Date());
    const date = moment(d);
    const diff = date.diff(today, 'days');
    const same = date.isSame(today, 'day');
    return same ? 'today' : diff < 0 ? 'past' : 'future';
  }
}
