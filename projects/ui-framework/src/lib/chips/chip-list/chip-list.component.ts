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

  private selectChip(chip: Chip) {
    chip.selected = !chip.selected;
    this.selected.emit(chip);
  }

  onChipRemove(chip: Chip) {
    this.removed.emit(chip);
  }

  onChipClick(event: MouseEvent, chip: Chip) {
    event.stopPropagation();
    if (this.config.selectable) {
      this.selectChip(chip);
    }
    this.clicked.emit(chip);
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip) {
    this.keyPressed.emit({ event, chip });

    if (this.config.focusable) {
      if (isKey(event.key, Keys.arrowleft) || isKey(event.key, Keys.arrowup)) {
        event.stopPropagation();
        const prevChip = (event.target as HTMLElement)
          .previousSibling as HTMLElement;
        if (prevChip.nodeName === 'B-CHIP') {
          prevChip.focus();
        }
      }
      if (
        isKey(event.key, Keys.arrowright) ||
        isKey(event.key, Keys.arrowdown)
      ) {
        event.stopPropagation();
        const nextChip = (event.target as HTMLElement)
          .nextSibling as HTMLElement;
        if (nextChip.nodeName === 'B-CHIP') {
          nextChip.focus();
        }
      }
    }

    if (this.config.selectable) {
      if (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter)) {
        event.stopPropagation();
        this.selectChip(chip);
      }
    }

    if (this.config.removable) {
      if (isKey(event.key, Keys.backspace) || isKey(event.key, Keys.delete)) {
        event.stopPropagation();
        this.onChipRemove(chip);
      }
    }
  }
}
