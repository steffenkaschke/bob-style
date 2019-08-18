import { Component, EventEmitter, Input, OnInit, Output, Type, ContentChild } from '@angular/core';
import { isEmpty, clone } from 'lodash';
import { ChainLink, SelectComponentConfig } from './chain-select.interface';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { ListChange } from '../list-change/list-change';
import { ChainSelectDirective } from './chain-select.directive';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss']
})
export class ChainSelectComponent implements OnInit {
  @Input() actionLabel: string;
  @Input() selectedItemList: [];
  @Output() selectChange: EventEmitter<{ $event: any, index: number }> =
    new EventEmitter<{ $event: any, index: number }>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  public chainLinkList: ChainLink[];
  public state: ListChange[];

  @ContentChild(ChainSelectDirective, { static: true }) contentChild !: ChainSelectDirective;

  constructor() {}

  ngOnInit() {
     this.chainLinkList = [];
  }

  public addChainLink() {
    this.chainLinkList.push(this.createEmptyChainLink(this.chainLinkList.length));
  }

  public removeChainLink(index: number) {
    this.chainLinkList.splice(index, 1);
    this.state.splice(index, 1);
    //this.selectChange.emit(this.state);
  }

  private createEmptyChainLink(index: number): ChainLink {
    return null;
  }

  public handleChange($event, index) {
    this.selectChange.emit({ $event, index });
  }
}
