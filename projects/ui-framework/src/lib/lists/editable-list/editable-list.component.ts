import {
  Component,
  OnInit,
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
import { Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import {
  EditableListViewItem,
  EditableListActions,
} from './editable-list.interface';
import {
  applyChanges,
  notFirstChanges,
  compareAsStrings,
  cloneObject,
  simpleUID,
  isKey,
} from '../../services/utils/functional-utils';
import { simpleChange } from '../../services/utils/test-helpers';
import { cloneDeep } from 'lodash';
import { MenuItem } from '../../navigation/menu/menu.interface';
import {
  EDITABLE_LIST_MENU_LABELS,
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
} from './editable-list.const';
import { Keys } from '../../enums';

export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) {
    return arr;
  }

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent implements OnChanges, OnInit {
  constructor(private cd: ChangeDetectorRef) {}

  @ViewChildren('itemEditInputs') itemEditInputs: QueryList<ElementRef>;

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

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  @HostListener('dblclick', ['$event'])
  onHostDblClick($event: MouseEvent) {
    const target = $event.target as HTMLInputElement;
    if (
      this.allowedActions.edit &&
      target.matches('.bel-item-input[readonly]')
    ) {
      const id = target.getAttribute('data-item-id');
      $event.preventDefault();
      this.itemEditEnable(id, target);
    }
  }

  @HostListener('focusout', ['$event'])
  onHostBlur($event: FocusEvent) {
    const target = $event.target as HTMLInputElement;
    if (
      this.allowedActions.edit &&
      target.matches('.bel-item-input:not([readonly])')
    ) {
      const id = target.getAttribute('data-item-id');
      this.itemEditDone(id, $event);
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
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        list: [],
        allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
      },
      [],
      true
    );

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

  onDrop(dropResult: DropResult) {
    console.log(dropResult);

    this.listIsAscending = undefined;
    this.listViewModel = applyDrag(this.listViewModel, dropResult);
    this.transmit();
  }

  itemEditEnable(id: string | number, inputEL: HTMLInputElement = null): void {
    const index = this.getItemIndexByID(id);
    if (index > -1) {
      const input =
        inputEL !== null
          ? inputEL
          : (this.itemEditInputs.toArray()[index]
              .nativeElement as HTMLInputElement);
      this.listViewModel[index].readonly = false;
      this.listViewModel[index].focused = true;
      input.focus();

      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }

  itemEditDone(id: string | number, $event: Event): void {
    const item = this.getItemByID(id) as EditableListViewItem;
    const input = $event.target as HTMLInputElement;
    if (item) {
      item.readonly = true;
      item.focused = false;
    }
    if (item && Boolean(input.value.trim())) {
      item.value = input.value;
      this.transmit();
    }
  }

  itemEditCancel(id: string | number, $event: Event): void {
    const item = this.getItemByID(id) as EditableListViewItem;
    const input = $event.target as HTMLInputElement;
    if (item) {
      item.readonly = true;
      item.focused = false;
    }
    input.value = item.value;
  }

  public addItem(): void {
    const id = simpleUID('', 10);
    this.listViewModel.unshift({
      id: id,
      value: '',
      readonly: false,
      focused: true,
      menu:
        (this.allowedActions.edit || this.allowedActions.remove) &&
        this.getItemMenu(id),
    });
    this.listIsAscending = undefined;
    this.cd.detectChanges();
    const input = this.itemEditInputs.toArray()[0]
      .nativeElement as HTMLInputElement;
    input.focus();
  }

  public removeItem(id: string | number) {
    const index = this.getItemIndexByID(id);
    this.listViewModel.splice(index, 1);
    this.transmit();
  }

  public sortList(): void {
    this.listViewModel.sort((a, b) => {
      const x = a.value.toLowerCase();
      const y = b.value.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    if (this.listIsAscending === true) {
      this.listViewModel.reverse();
    }
    this.listIsAscending = !this.listIsAscending;
    this.transmit();
  }

  public resetList(value: SelectOption[] = null): void {
    this.ngOnChanges(
      simpleChange({
        list: value || this.list,
      })
    );
    this.transmit(value || this.list);
  }

  private getItemIndexByID(
    id: string | number,
    list: (EditableListViewItem | SelectOption)[] = this.listViewModel
  ): number {
    return list.findIndex(i => compareAsStrings(i.id, id));
  }

  private getItemByID(
    id: string | number,
    list: (EditableListViewItem | SelectOption)[] = this.listViewModel
  ): EditableListViewItem | SelectOption {
    return list.find(i => compareAsStrings(i.id, id));
  }

  private transmit(value: SelectOption[] = null): void {
    this.updatedList =
      value !== null
        ? cloneDeep(value)
        : this.listViewModel
            .filter(item => Boolean(item.value.trim()))
            .map((item: EditableListViewItem) => ({
              ...this.getItemByID(item.id, this.list),
              id: item.id,
              value: item.value,
            }));
    this.changed.emit(this.updatedList);
  }

  private getItemMenu(id: string | number): MenuItem[] {
    const menu: MenuItem[] = [];
    if (this.allowedActions.edit) {
      menu.push({
        label: EDITABLE_LIST_MENU_LABELS.edit,
        action: () => this.itemEditEnable(id),
      });
    }
    if (this.allowedActions.remove) {
      menu.push({
        label: EDITABLE_LIST_MENU_LABELS.remove,
        action: () => this.removeItem(id),
      });
    }
    return menu;
  }

  public listTrackBy(index: number, item: SelectOption): string | number {
    return item.id;
  }
}
