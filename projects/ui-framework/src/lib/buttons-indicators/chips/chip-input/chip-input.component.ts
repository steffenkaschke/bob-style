import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { ColorService } from '../../../services/color-service/color.service';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'b-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss']
})
export class ChipInputComponent {
  constructor() {}

  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipInputControl = new FormControl();

  allChips: any[];
  filteredChips: Observable<any[]>;
  selectedChips: any[];

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('auto') autocomplete: MatAutocomplete;

  add(event: MatChipInputEvent): void {}

  remove(fruit: string): void {}

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.fruits.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    // this.fruitCtrl.setValue(null);
  }

  private filter(value: string): string[] {
    // const filterValue = value.toLowerCase();
    // return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    return [];
  }
}
