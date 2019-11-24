import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectOption } from '../list.interface';

import { DropResult } from 'ngx-smooth-dnd';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import {
  EditableListViewItem,
  EditableListActions,
} from './editable-list.interface';
import {
  applyChanges,
  notFirstChanges,
  cloneObject,
  simpleUID,
  isKey,
  arrOfObjSortByProp,
} from '../../services/utils/functional-utils';
import { simpleChange } from '../../services/utils/test-helpers';
import { cloneDeep } from 'lodash';
import { MenuItem } from '../../navigation/menu/menu.interface';
import {
  EDITABLE_LIST_TRANSLATION,
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
} from './editable-list.const';
import { Keys } from '../../enums';
import { EditableListService } from './editable-list.service';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent implements OnChanges {
  constructor(
    private srvc: EditableListService,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChildren('itemEditInput') itemEditInputs: QueryList<ElementRef>;

  @Input() list: SelectOption[] = [];
  @Input() allowedActions: EditableListActions = cloneObject(
    EDITABLE_LIST_ALLOWED_ACTIONS_DEF
  );

  @Output() changed: EventEmitter<SelectOption[]> = new EventEmitter<
    SelectOption[]
  >();

  public listViewModel: EditableListViewItem[] = [];
  public updatedList: SelectOption[];

  public listIsAscending: boolean;
  public editingItem: EditableListViewItem | null = null;
  public deletingItem: EditableListViewItem | null = null;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly translation = EDITABLE_LIST_TRANSLATION;

  @HostListener('dblclick', ['$event'])
  onHostDblClick($event: MouseEvent) {
    const target = $event.target as HTMLInputElement;
    if (
      this.allowedActions.edit &&
      target.matches('.bel-item-input[readonly]')
    ) {
      $event.preventDefault();
      const id = target.getAttribute('data-item-id');
      this.itemEditStart(id, target);
    }
  }

  @HostListener('focusout', ['$event'])
  onHostBlur($event: FocusEvent) {
    const target = $event.target as HTMLInputElement;
    const relatedTarget = $event.relatedTarget as HTMLElement;
    const id = target.getAttribute('data-item-id');

    if (
      this.allowedActions.edit &&
      target.matches('.bel-item-input.edit-mode')
    ) {
      this.itemEditDone(id, $event);
    }

    if (
      this.deletingItem &&
      (!relatedTarget || !relatedTarget.matches('.bel-remove-button button'))
    ) {
      const item = this.deletingItem as EditableListViewItem;
      item.showRemoveConfirm = false;
      item.focused = false;
      this.deletingItem = null;
    }
  }

  @HostListener('click', ['$event'])
  onHostClick($event: MouseEvent) {
    const target = $event.target as HTMLInputElement;

    if (target.matches('.bel-remove-button button')) {
      const id = target.parentElement.getAttribute('data-item-id');
      this.removeItem(id, true);
    }
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;

    if (
      this.allowedActions.edit &&
      target.matches('.bel-item-input:not([readonly])')
    ) {
      const id = target.getAttribute('data-item-id');

      if (isKey($event.key, Keys.enter) || isKey($event.key, Keys.tab)) {
        $event.preventDefault();
        this.itemEditDone(id, $event);
      }

      if (isKey($event.key, Keys.escape)) {
        $event.preventDefault();
        this.itemEditCancel(id, $event);
      }
    }

    if (this.deletingItem) {
      const item = this.deletingItem as EditableListViewItem;

      if (isKey($event.key, Keys.enter)) {
        this.removeItem(item.id, true);
      }

      if (isKey($event.key, Keys.tab) || isKey($event.key, Keys.escape)) {
        item.showRemoveConfirm = false;
        item.focused = false;
      }

      this.deletingItem = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(this, changes, {
      list: [],
      allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
    });

    if (changes.list) {
      this.listViewModel = this.list.map((item: SelectOption) => ({
        ...item,
        readonly: true,
        focused: false,
        menu:
          (this.allowedActions.edit || this.allowedActions.remove) &&
          this.getItemMenu(item.id),
      }));
    }

    if (
      notFirstChanges(changes, ['allowedActions']) &&
      (changes.allowedActions.previousValue.edit !==
        changes.allowedActions.currentValue.edit ||
        changes.allowedActions.previousValue.remove !==
          changes.allowedActions.currentValue.remove)
    ) {
      this.listViewModel.forEach(item => {
        item.menu =
          (this.allowedActions.edit || this.allowedActions.remove) &&
          this.getItemMenu(item.id);
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onItemMove(dropResult: DropResult) {
    if (this.srvc.onItemMove(this.listViewModel, dropResult)) {
      this.listIsAscending = undefined;
      this.transmit();
    }
  }

  itemEditStart(
    id: string | number,
    inputEL: HTMLInputElement = null,
    list: EditableListViewItem[] = this.listViewModel
  ): void {
    const index = this.srvc.getItemIndexByID(id, this.listViewModel);
    if (index > -1) {
      const input =
        inputEL !== null
          ? inputEL
          : (this.itemEditInputs.toArray()[index]
              .nativeElement as HTMLInputElement);
      list[index].readonly = false;
      list[index].focused = true;
      this.editingItem = list[index];
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }

  // COMBINE itemEditDone with itemEditCancel
  itemEditDone(id: string | number, $event: Event): void {
    this.editingItem = null;
    const item = this.srvc.getItemByID(
      id,
      this.listViewModel
    ) as EditableListViewItem;
    const input = $event.target as HTMLInputElement;
    if (item) {
      item.readonly = true;
      item.focused = false;
    }
    if (item && Boolean(input.value.trim())) {
      item.value = input.value;
      this.transmit();
    } else if (item) {
      this.removeItem(id, true);
    }
  }

  // COMBINE itemEditDone with itemEditCancel
  itemEditCancel(id: string | number, $event: Event): void {
    this.editingItem = null;
    const item = this.srvc.getItemByID(
      id,
      this.listViewModel
    ) as EditableListViewItem;
    const input = $event.target as HTMLInputElement;

    if (item && !Boolean(item.value) && !Boolean(input.value.trim())) {
      this.removeItem(id, true);
    } else if (item) {
      item.readonly = true;
      item.focused = false;
      input.value = item.value;
    }
  }

  public addItem(): void {
    const id = simpleUID('new-');
    this.listViewModel.unshift({
      id: id,
      value: '',
      readonly: false,
      focused: true,
      new: true,
      menu:
        (this.allowedActions.edit || this.allowedActions.remove) &&
        this.getItemMenu(id),
    });
    this.editingItem = this.listViewModel[0];
    this.listIsAscending = undefined;
    this.cd.detectChanges();
    const input = this.itemEditInputs.toArray()[0]
      .nativeElement as HTMLInputElement;
    input.focus();
  }

  public removeItem(
    id: string | number,
    confirm: boolean = null,
    list: EditableListViewItem[] = this.listViewModel
  ) {
    this.editingItem = null;
    const index = this.srvc.getItemIndexByID(id, this.listViewModel);

    if (index > -1 && confirm === null) {
      list[index].focused = true;
      list[index].showRemoveConfirm = true;
      this.deletingItem = list[index];

      const input = this.itemEditInputs.toArray()[index]
        .nativeElement as HTMLInputElement;
      input.focus();
    }

    if (index > -1 && confirm === false) {
      list[index].focused = false;
      list[index].showRemoveConfirm = false;
      this.deletingItem = null;
    }

    if (index > -1 && confirm === true) {
      list.splice(index, 1);
      this.transmit();
      this.deletingItem = null;
    }
    this.cd.detectChanges();
  }

  // keep here
  public sortList(list: EditableListViewItem[] = this.listViewModel): void {
    arrOfObjSortByProp(list, 'value', this.listIsAscending !== true);
    this.listIsAscending = !this.listIsAscending;
    this.transmit();
  }

  // keep here
  public resetList(value: SelectOption[] = null): void {
    this.ngOnChanges(
      simpleChange({
        list: value || this.list,
      })
    );
    this.transmit(value || this.list);
  }

  // keep here
  private transmit(
    value: SelectOption[] = null,
    list: EditableListViewItem[] = this.listViewModel
  ): void {
    this.updatedList =
      value !== null
        ? cloneDeep(value)
        : list
            .filter(item => Boolean(item.value.trim()))
            .map((item: EditableListViewItem) => ({
              ...this.srvc.getItemByID(item.id, this.list),
              value: item.value,
            }));
    this.changed.emit(this.updatedList);
  }

  // keep here
  private getItemMenu(
    id: string | number,
    allowedActions: EditableListActions = this.allowedActions
  ): MenuItem[] {
    const menu: MenuItem[] = [];
    if (allowedActions.edit) {
      menu.push({
        label: EDITABLE_LIST_TRANSLATION.edit,
        action: () => this.itemEditStart(id),
      });
    }
    if (allowedActions.remove) {
      menu.push({
        label: EDITABLE_LIST_TRANSLATION.remove,
        action: () => this.removeItem(id),
      });
    }
    return menu;
  }

  // keep here
  public listTrackBy(index: number, item: SelectOption): string | number {
    return item.id;
  }
}
