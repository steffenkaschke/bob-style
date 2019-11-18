import { Component, Input, OnInit } from '@angular/core';
import { BasicListItem } from './basic-list.interface';
import { MenuItem } from '../../../navigation/menu/menu.interface';

@Component({
  selector: 'b-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.scss']
})
export class BasicListComponent implements OnInit {
  @Input() items: BasicListItem[];
  @Input() menu?: MenuItem[];

  constructor() { }

  ngOnInit() {
  }
}
