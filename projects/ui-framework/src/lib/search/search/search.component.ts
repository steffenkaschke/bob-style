import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges
} from '@angular/core';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.value = changes.value.currentValue;
    }
  }

  onFocus(): void {
    this.inputFocused = true;
    this.searchIconColor = IconColor.dark;
  }

  onBlur(): void {
    this.inputFocused = false;
    this.searchIconColor = IconColor.normal;
  }

  onInput(event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(this.value);
  }

  onResetClick(): void {
    this.value = '';
    this.searchChange.emit(this.value);
  }
}
