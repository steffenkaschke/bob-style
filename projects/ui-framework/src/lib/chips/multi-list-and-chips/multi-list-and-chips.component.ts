import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges,
  ElementRef
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../form-elements/lists/list.consts';
import {
  SelectGroupOption,
  SelectOption
} from '../../form-elements/lists/list.interface';
import { ChipListConfig, Chip } from '../chips.interface';
import { ChipType } from '../chips.enum';
import { MultiListComponent } from '../../form-elements/lists/multi-list/multi-list.component';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { simpleUID } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-multi-list-and-chips',
  templateUrl: './multi-list-and-chips.component.html',
  styleUrls: ['./multi-list-and-chips.component.scss']
})
export class MultiListAndChipsComponent implements OnChanges {
  constructor(private host: ElementRef) {}

  @ViewChild('list', { static: true }) list: MultiListComponent;
  @ViewChild('chips', { static: true }) chiplist: ChipListComponent;

  @Input() options: SelectGroupOption[] = [];

  @Input() listLabel = 'Select fields:';
  @Input() chipsLabel = 'Selected fields:';

  public chips = [];

  readonly listElHeight: number = LIST_EL_HEIGHT;
  readonly chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    selectable: false,
    removable: true
  };
  readonly listID = simpleUID('mlacl-');
  readonly chipListID = simpleUID('mlacc-');

  public onListChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.optionsToChips(listChange.getSelectGroupOptions());
  }

  private optionsToChips(options: SelectGroupOption[] = this.options): Chip[] {
    const chips = [];

    options.forEach((group: SelectGroupOption) => {
      if (group.options.every((option: SelectOption) => option.selected)) {
        chips.push({
          text: group.groupName + ' (all)',
          group: {
            key: group.key,
            name: group.groupName
          },
          type: ChipType.info
        });
      } else {
        group.options.forEach((option: SelectOption) => {
          if (option.selected) {
            chips.push({
              text: option.value,
              id: option.id
            });
          }
        });
      }
    });

    return (this.chips = chips);
  }

  public removeChipAndOption(chip: Chip) {
    const options = [].concat(this.options);

    if ((chip as any).group) {
      const group = options.find(
        (g: SelectGroupOption) =>
          (g.key && g.key === (chip as any).group.key) ||
          g.groupName === (chip as any).group.name
      );

      group.options.forEach((option: SelectOption) => {
        option.selected = false;
      });

      this.chips = this.chips.filter(
        (ch: any) =>
          !ch.group ||
          ((ch.group &&
            ch.group.key &&
            ch.group.key !== (chip as any).group.key) ||
            (ch.group && ch.group.name !== (chip as any).group.name))
      );
    } else {
      options.find((group: SelectGroupOption) => {
        const opt = group.options.find((o: SelectOption) => o.id === chip.id);
        if (opt) {
          opt.selected = false;
          return true;
        }
        return false;
      });

      this.chips = this.chips.filter((ch: any) => ch.id !== chip.id);
    }

    return (this.options = options);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.options = changes.options.currentValue;
      this.optionsToChips();

      setTimeout(() => {
        this.host.nativeElement.style.height =
          this.host.nativeElement.offsetHeight + 'px';
      }, 0);
    }
  }
}
