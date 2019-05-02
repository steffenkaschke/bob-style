import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChipOptions } from '../chips.interface';
import { startWith, map } from 'rxjs/operators';
import { Icons, IconColor, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss']
})
export class ChipInputComponent {
  @Input('chips')
  set chips(value: ChipOptions[]) {
    this.allChips = value;
  }
  @Input() placeholder: string;
  @Input() removable = true;
  @Input() acceptNew = true;
  @Input() addOnBlur = false;

  private allChips: ChipOptions[];
  filteredChips: Observable<ChipOptions[]>;
  selectedChips: ChipOptions[] = [];

  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly chipInputControl = new FormControl();

  @ViewChild('input') private input: ElementRef<HTMLInputElement>;
  @ViewChild('auto') private autocomplete: MatAutocomplete;

  constructor() {
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
}
