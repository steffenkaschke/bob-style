import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EmojiChip} from './emoji-chip-list.interface';

@Component({
  selector: 'b-emoji-chip-list',
  templateUrl: './emoji-chip-list.component.html',
  styleUrls: ['./emoji-chip-list.component.scss']
})
export class EmojiChipListComponent {
  @Input() valueFormatter: Function;
  @Input() chips: EmojiChip[];
  @Output() chipClicked = new EventEmitter<EmojiChip>();

  valueFormatterFn(val): string | number {
    return typeof this.valueFormatter === 'function'
      ? this.valueFormatter(val)
      : val;
  }

  chipClick(chip: EmojiChip) {
    this.chipClicked.emit(chip);
  }
}
