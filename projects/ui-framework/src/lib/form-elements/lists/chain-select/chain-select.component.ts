import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { isEmpty } from 'lodash';
import { ChainLink, ChainListChange } from './chain-select.interface';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss']
})
export class ChainSelectComponent implements OnInit {
  @Input() actionLabel: string;
  @Input() selectComponent: Type<any>;
  @Input() selectedIdsKey?: string;
  @Input() outputKey: string;
  @Input() selectedIds?: (string[]| number[])[] = [];
  @Output() selectChange: EventEmitter<ChainListChange> =
    new EventEmitter<ChainListChange>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  public chainLinkList: ChainLink[];

  constructor() {}

  ngOnInit() {
    if (isEmpty(this.selectedIds) || !this.selectedIdsKey) {
      this.chainLinkList = [this.createEmptyChainLink(0)];
    } else {
      this.chainLinkList = this.selectedIds.map((sel, index) => ({
        active: false,
        selectComponentConfig: {
          component: this.selectComponent,
          attributes: {
            [this.selectedIdsKey]: sel,
          },
          handlers: {
            [this.outputKey]: $event => this.selectChange.emit({ index, listChange: $event })
          }
        }
      }));
    }
  }

  public addChainLink() {
    this.chainLinkList.push(this.createEmptyChainLink(this.chainLinkList.length));
  }

  public removeChainLink(index: number) {
    this.chainLinkList.splice(index, 1);
    this.selectChange.emit({ index, listChange: null });
  }

  public activateChainLink(event, index: number) {
    this.chainLinkList[index].active = true;
  }

  public deactivateChainLink(event, index: number) {
    this.chainLinkList[index].active = false;
  }

  private createEmptyChainLink(index: number): ChainLink {
    return {
      active: false,
      selectComponentConfig: {
        component: this.selectComponent,
        handlers: {
          [this.outputKey]: $event => this.selectChange.emit({ index, listChange: $event })
        }
      }
    };
  }
}
