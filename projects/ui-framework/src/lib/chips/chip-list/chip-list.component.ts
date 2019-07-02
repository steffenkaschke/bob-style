import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { Chip, ChipListConfig } from '../chips.interface';

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
  @Output() keyPressed: EventEmitter<{
    event: KeyboardEvent;
    chip: Chip;
  }> = new EventEmitter<{ event: KeyboardEvent; chip: Chip }>();

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
  }
}
