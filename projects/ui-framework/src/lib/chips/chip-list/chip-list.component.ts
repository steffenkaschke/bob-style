import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { Chip } from '../chip.interface';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent {
  constructor() {}

  @Input() chips: Chip[];

  @Output() removed: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() clicked: EventEmitter<{
    event: KeyboardEvent;
    chip: Chip;
  }> = new EventEmitter<{ event: KeyboardEvent; chip: Chip }>();

  @HostBinding('attr.role') role = 'list';

  onChipRemove(chip: Chip) {
    this.removed.emit(chip);
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip) {
    this.clicked.emit({ event, chip });
  }
}
