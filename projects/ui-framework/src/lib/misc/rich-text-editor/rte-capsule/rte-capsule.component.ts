import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SelectGroupOption} from '../../../form-elements/lists/list.interface';
import {QuillOptionsStatic} from 'quill';
import quillLib from 'quill';

@Component({
  selector: 'b-rte-capsule',
  templateUrl: './rte-capsule.component.html',
  styleUrls: ['./rte-capsule.component.scss'],
})
export class RteCapsuleComponent implements OnInit, OnChanges {
  @Output() capsuleUpdate: EventEmitter<any> = new EventEmitter<any>();

  capsuleOptions: SelectGroupOption[];

  constructor() {}
  ngOnInit(): void {
    this.capsuleOptions = [
      {
        groupName: 'hhh',
        options: [
          {value: 'displayName', id: 1, selected: false},
          {value: 'firstName', id: 2, selected: false},
        ]
      },
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {}
  onAdd(): void {
    // this.linkUpdate.emit(this.rteLink);
  }
  test() {
    this.capsuleUpdate.emit({text: 'bb', url: 'sdds'} );
  }
}
