import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete,
  MatChipList,
  MatAutocompleteTrigger
} from '@angular/material';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChipOptions } from '../chips.interface';
import { startWith, map } from 'rxjs/operators';
import { Icons, IconColor, IconSize } from '../../../icons/icons.enum';
import { BaseFormElement } from '../../../form-elements/base-form-element';
import { ChipType } from '../chips.enum';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    }
  ]
})
export class ChipInputComponent extends BaseFormElement {
  @Input('chips')
  set chips(value: ChipOptions[]) {
    this.allChips = value;
  }

  @Input() acceptNew = true;
  @Input() colorService: Function;

  removable = true;
  addOnBlur = false;
  private allChips: ChipOptions[];
  filteredChips: Observable<ChipOptions[]>;
  selectedChips: ChipOptions[] = [];

  readonly chipType = ChipType;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly chipInputControl = new FormControl();

  @ViewChild('chipList') private chipList: MatChipList;
  @ViewChild('input') private input: ElementRef<HTMLInputElement>;
  @ViewChild('auto') private autocomplete: MatAutocomplete;
  @ViewChild('input', { read: MatAutocompleteTrigger })
  private autocompleteTrigger: MatAutocompleteTrigger;

  constructor() {
    super();

    this.filteredChips = this.chipInputControl.valueChanges.pipe(
      startWith(null),
      map((chip: string | null) =>
        chip ? this.filterChips(chip) : this.allChips.slice()
      )
    );
  }

  private findChip(text: string, chipsSource = this.allChips): ChipOptions {
    return chipsSource.find(chip => chip.text === text);
  }

  private removeChip(text: string, chipsSource = this.allChips): ChipOptions[] {
    return chipsSource.filter(chip => chip.text !== text);
  }

  private filterChips(
    text: string,
    chipsSource = this.allChips
  ): ChipOptions[] {
    return chipsSource.filter(
      chip => chip.text.toLowerCase().indexOf(text.toLowerCase()) === 0
    );
  }

  commitChip(chipToAdd: ChipOptions): void {
    if (chipToAdd && !this.findChip(chipToAdd.text, this.selectedChips)) {
      this.selectedChips.push(chipToAdd);
      this.input.nativeElement.value = '';
      this.chipInputControl.setValue(null);
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.autocomplete.isOpen) {
      const text = (event.value || '').trim();
      let chipToAdd;

      if (text) {
        chipToAdd = this.findChip(text);

        if (!chipToAdd && this.acceptNew) {
          chipToAdd = { text };
          if (this.colorService) {
            chipToAdd.color = this.colorService();
          }
        }
      }

      this.commitChip(chipToAdd);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const chipToAdd = this.findChip(event.option.viewValue);
    this.commitChip(chipToAdd);
  }

  remove(chip: ChipOptions): void {
    this.selectedChips = this.removeChip(chip.text, this.selectedChips);
  }

  onKeyBackspace(): void {
    if (
      this.input.nativeElement.value === '' &&
      (this.chipList.chips.last as any)
    ) {
      if ((this.chipList.chips.last as any).aboutToDelete) {
        this.selectedChips.pop();
      } else {
        this.chipList.chips.last.selected = true;
        (this.chipList.chips.last as any).aboutToDelete = true;
      }

      setTimeout(() => {
        this.input.nativeElement.focus();
        this.autocompleteTrigger.closePanel();
      }, 0);
    }
  }
}
