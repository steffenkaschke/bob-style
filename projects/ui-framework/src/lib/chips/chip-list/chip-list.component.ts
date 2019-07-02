import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { Chip, ChipListConfig } from '../chip.interface';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent {
  constructor() {}

  @Input() chips: Chip[] = [];
  @Input() config: ChipListConfig = {};

  @Output() removed: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() selected: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() clicked: EventEmitter<{
    event: KeyboardEvent;
    chip: Chip;
  }> = new EventEmitter<{ event: KeyboardEvent; chip: Chip }>();

  @HostBinding('attr.role') role = 'list';

  onChipClick(event: MouseEvent, chip: Chip) {
    chip.selected = !chip.selected;
    this.selected.emit(chip);
  }

  onChipRemove(chip: Chip) {
    this.removed.emit(chip);
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip) {
    this.clicked.emit({ event, chip });
  }
}
