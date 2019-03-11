import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import head from 'lodash/head';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() options: SideMenuOption[];
  @Output() selectOption: EventEmitter<string> = new EventEmitter<string>();

  public selectedId: string;

  constructor() {
  }

  ngOnInit() {
    this.onSelectOption(head(this.options).id);
  }

  onSelectOption(id: string): void {
    this.selectedId = id;
    this.selectOption.emit(id);
  }

}
