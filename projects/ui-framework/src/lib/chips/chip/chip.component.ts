import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  HostBinding,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { applyChanges } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-chip, [b-chip]',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnChanges {
  constructor(public chip: ElementRef) {}

  @Input() text: string;
  @Input() removable = false;
  @Input() icon: Icons;

  @HostBinding('attr.data-type') @Input() type: ChipType = ChipType.tag;
  @HostBinding('attr.data-disabled') @Input() disabled = false;
  @HostBinding('attr.data-selected') @Input() selected = false;

  @Output() removed: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly chipType = ChipType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(this, changes, {
      type: ChipType.tag
    });

    if (changes.type || changes.icon) {
      if (this.type === ChipType.icon && this.icon) {
        this.chip.nativeElement.classList.add('b-icon-dark', 'b-icon-large', this.icon);
      } else {
        this.chip.nativeElement.className = this.chip.nativeElement.className
          .split(' ')
          .filter((c: string) => Boolean(c.trim()) && !c.includes('b-icon'))
          .join(' ');
      }
    }
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.removed.observers.length > 0) {
      this.removed.emit(event);
    }
  }
}
