import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
  SimpleChanges,
  OnChanges,
  HostListener
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
export class ChipInputComponent extends BaseFormElement
  implements OnChanges, OnInit {
  @Input() value: string[] = [];
  @Input() options: string[];
  @Input() acceptNew = true;
  @Input() placeholder: string;

  filteredChips: Observable<string[]>;
  possibleChips: string[] = [];

  removable = true;
  addOnBlur = false;
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
        chip ? this.filterChips(chip) : this.possibleChips.slice()
      )
    );
  }

  @HostListener('document:click', ['$event']) handleDocClick(
    event: MouseEvent
  ) {
    this.unSelectLastChip();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.firstChange) {
      this.value = changes.value.currentValue;
      this.updatePossibleChips();
    }
    if (changes.options && !changes.options.firstChange) {
      this.options = changes.options.currentValue;
      this.updatePossibleChips();
    }
  }

  ngOnInit(): void {
    this.updatePossibleChips();
  }

  private propagateValue() {
    this.propagateChange(this.value);
    this.onTouched();
  }

  private updatePossibleChips(init = false) {
    this.possibleChips = this.options.filter(
      ch => !this.value.find(c => c.toLowerCase() === ch.toLowerCase())
    );
  }

  private findChip(name: string, chipsSource = this.possibleChips): string {
    return chipsSource.find(chip => chip.toLowerCase() === name.toLowerCase());
  }

  private removeChip(name: string, chipsSource = this.possibleChips): string[] {
    return chipsSource.filter(
      chip => chip.toLowerCase() !== name.toLowerCase()
    );
  }

  private filterChips(
    name: string,
    chipsSource = this.possibleChips
  ): string[] {
    return chipsSource.filter(
      chip => chip.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  private commitChip(chipToAdd: string): void {
    if (chipToAdd && !this.findChip(chipToAdd, this.value)) {
      this.value.push(chipToAdd);
      this.updatePossibleChips();
      this.propagateValue();
      this.input.nativeElement.value = '';
      this.chipInputControl.setValue(null);
    } else if (chipToAdd) {
      const existingChipElemnent = this.chipList.chips.find(
        ch =>
          ch._elementRef.nativeElement.innerText.toLowerCase() ===
          chipToAdd.toLowerCase()
      )._elementRef.nativeElement;

      if (existingChipElemnent) {
        existingChipElemnent.classList.add('blink');
        setTimeout(() => {
          existingChipElemnent.classList.remove('blink');
        }, 200);
      }
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.autocomplete.isOpen) {
      const name = (event.value || '').trim();
      let chipToAdd = this.findChip(name);

      if (!chipToAdd && this.acceptNew) {
        chipToAdd = name;
      }

      this.commitChip(chipToAdd);
      this.autocompleteTrigger.closePanel();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const chipToAdd = this.findChip(event.option.viewValue);
    this.commitChip(chipToAdd);
  }

  remove(name: string): void {
    this.value = this.removeChip(name, this.value);
    this.updatePossibleChips();
    this.propagateValue();
    this.autocompleteTrigger.closePanel();
  }

  private unSelectLastChip(): void {
    if (
      this.chipList.chips.last &&
      (this.chipList.chips.last as any).aboutToDelete
    ) {
      delete (this.chipList.chips.last as any).aboutToDelete;
      this.chipList.chips.last.selected = false;
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key.toUpperCase() === 'BACKSPACE') {
      if (this.input.nativeElement.value === '' && this.chipList.chips.last) {
        if ((this.chipList.chips.last as any).aboutToDelete) {
          this.value.pop();
          this.updatePossibleChips();
        } else {
          this.chipList.chips.last.selected = true;
          (this.chipList.chips.last as any).aboutToDelete = true;
        }

        setTimeout(() => {
          this.input.nativeElement.focus();
          this.autocompleteTrigger.closePanel();
        }, 0);
      }
    } else {
      this.unSelectLastChip();
    }
  }
}
