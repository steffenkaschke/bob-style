import { Component, OnInit, Input } from '@angular/core';
import { Chip } from '../chip.interface';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent {
  constructor() {}

  @Input() chips: Chip[];
}
