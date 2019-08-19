import { Component, EventEmitter, Input, OnInit, Output, Type, ContentChild } from '@angular/core';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { ChainSelectDirective } from './chain-select.directive';
import { ChainSelectEvent } from './chain-select.interface';
import { ChainSelectEventEnum } from './chain-select.enum';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss']
})
export class ChainSelectComponent {
  @Input() actionLabel: string;
  @Input() selectedItemList: any[] = [null];
  @Output() selectChange: EventEmitter<ChainSelectEvent> =
    new EventEmitter<ChainSelectEvent>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  @ContentChild(ChainSelectDirective, { static: true }) contentChild !: ChainSelectDirective;

  public addChainLink() {
    this.selectedItemList.push(null);
  }

  public removeChainLink(index: number) {
    this.selectedItemList.splice(index, 1);
    this.selectChange.emit({
      index,
      event: ChainSelectEventEnum.delete,
    });
  }

  public handleChange($event, index) {
    this.selectChange.emit({ index, event: $event });
  }
}
