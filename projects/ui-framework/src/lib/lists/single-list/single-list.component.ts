import {
  Component,
  Input,
  Renderer2,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListHeader, ListOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent extends BaseListElement {
  constructor(
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService,
    listModelService: ListModelService,
    listChangeService: ListChangeService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers,
    host: ElementRef
  ) {
    super(
      renderer,
      listKeyboardService,
      listModelService,
      listChangeService,
      cd,
      zone,
      DOM,
      host
    );
    this.listActions = {
      clear: false,
      apply: false,
      reset: false,
    };
  }

  @Input() showNoneOption = false;

  public selectedID: string | number;

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      header.isCollapsed = !header.isCollapsed;

      this.updateLists({
        updateListHeaders: false,
        selectedIDs: [this.selectedID],
      });

      this.allGroupsCollapsed =
        this.listOptions.length === this.listHeaders.length;
    }
  }

  optionClick(option: ListOption, index: number): void {
    if (!option.disabled) {
      option.selected = true;
      this.selectedID = option.id;

      this.updateLists({
        updateListHeaders: false,
        updateListOptions: false,
        selectedIDs: [this.selectedID],
      });

      this.emitChange();
    }
  }

  getListHeight(): number {
    return (
      (this.listOptions.length + (this.showNoneOption ? 1 : 0)) *
      this.listElHeight
    );
  }

  private emitChange(): void {
    const listChange = this.listChangeService.getListChange(this.options, [
      this.selectedID,
    ]);

    this.options = listChange.getSelectGroupOptions();

    this.selectChange.emit(listChange);
  }
}
