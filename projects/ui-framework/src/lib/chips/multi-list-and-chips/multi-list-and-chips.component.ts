import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../form-elements/lists/list.consts';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { ChipListConfig, Chip } from '../chips.interface';
import { ChipType } from '../chips.enum';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { MultiListComponent } from '../../form-elements/lists/multi-list/multi-list.component';
import { ChipListComponent } from '../chip-list/chip-list.component';

@Component({
  selector: 'b-multi-list-and-chips',
  templateUrl: './multi-list-and-chips.component.html',
  styleUrls: ['./multi-list-and-chips.component.scss']
})
export class MultiListAndChipsComponent implements OnChanges {
  constructor() {}

  @ViewChild('list', { static: true }) list: MultiListComponent;
  @ViewChild('chips', { static: true }) chiplist: ChipListComponent;

  @Input() options: SelectGroupOption[] = [];

  public chips = [];

  readonly listElHeight: number = LIST_EL_HEIGHT;
  readonly chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    selectable: false,
    removable: true
  };

  private optionsToChips(options: SelectGroupOption[] = this.options): Chip[] {
    const chips = [];

    options.forEach(group => {
      if (group.options.every(option => option.selected)) {
        chips.push({
          text: group.groupName + ' (all)',

          group: {
            key: group.key,
            name: group.groupName
          },
          type: ChipType.info
        });
      } else {
        group.options.forEach(option => {
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

  private chipsToOptions(chips) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.options = changes.options.currentValue;
      this.optionsToChips();
    }
  }

  public onSelectChange(change: ListChange) {
    console.log(change);
    this.optionsToChips(change.getSelectGroupOptions());
  }

  public onChipRemoved(chip: Chip) {
    console.log(chip);

    if ((chip as any).group) {
      const group = this.options.find(
        g =>
          (g.key && g.key === (chip as any).group.key) ||
          g.groupName === (chip as any).group.name
      );
      console.log(group);
      group.options.forEach(option => {
        option.selected = false;
      });
    }
  }
}
