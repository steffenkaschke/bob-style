import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { Chip, ChipListConfig, ChipKeydownEvent } from '../chips.interface';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent {
  constructor() {}

  @HostBinding('attr.role') role = 'list';

  @Input() chips: Chip[] = [];
  @Input() config: ChipListConfig = {};

  @Output() removed: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() selected: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() clicked: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() keyPressed: EventEmitter<ChipKeydownEvent> = new EventEmitter<
    ChipKeydownEvent
  >();

  onChipClick(event: MouseEvent, chip: Chip) {
    event.stopPropagation();
    if (this.config.selectable || chip.selectable) {
      chip.selected = !chip.selected;
      this.selected.emit(chip);
    }
    this.clicked.emit(chip);
  }

  onChipRemove(chip: Chip) {
    this.removed.emit(chip);
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip) {
    this.keyPressed.emit({ event, chip });

    if (isKey(event.key, Keys.arrowleft)) {
      const prevChip = (event.target as HTMLElement)
        .previousSibling as HTMLElement;
      if (prevChip.nodeName === 'B-CHIP') {
        prevChip.focus();
      }
    }
    if (isKey(event.key, Keys.arrowright)) {
      const nextChip = (event.target as HTMLElement).nextSibling as HTMLElement;
      if (nextChip.nodeName === 'B-CHIP') {
        nextChip.focus();
      }
    }
  }
}
