import { Component, EventEmitter, Output, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../../form-elements/input/input.enum';
import { simpleUID } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './search.component.scss'
  ]
})
export class SearchComponent {
  constructor() {}

  @Input() value = '';
  @Input() label: string;
  @Input() placeholder: string;

  public id = simpleUID('bsrch-');
  public inputFocused = false;
  public searchIconColor: String = IconColor.normal;
  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly inputTypes = InputTypes;

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  onFocus() {
    this.inputFocused = true;
    this.searchIconColor = IconColor.dark;
  }

  onBlur() {
    this.inputFocused = false;
    this.searchIconColor = IconColor.normal;
  }

  onInput(event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(this.value);
  }

  onResetClick() {
    this.value = '';
    this.searchChange.emit(this.value);
  }
}
