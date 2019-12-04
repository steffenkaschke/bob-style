import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectOption } from '../list.interface';

import { DropResult } from 'ngx-smooth-dnd';
import { Icons } from '../../icons/icons.enum';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import {
  EditableListActions,
  EditableListTranslation,
  EditableListState,
} from './editable-list.interface';
import {
  applyChanges,
  notFirstChanges,
  cloneObject,
  arrOfObjSortByProp,
  hasChanges,
  arrayIntersection,
  isNotEmptyArray,
  cloneArray,
} from '../../services/utils/functional-utils';
import { simpleChange } from '../../services/utils/test-helpers';
import { cloneDeep } from 'lodash';
import {
  EDITABLE_LIST_TRANSLATION,
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
} from './editable-list.const';
import { ListSortType } from './editable-list.enum';
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

  @Input() list: SelectOption[] = [];
  @Input() sortType: ListSortType;

  @Input() allowedActions: EditableListActions = cloneObject(
    EDITABLE_LIST_ALLOWED_ACTIONS_DEF
  );
  @Input() translation: EditableListTranslation = cloneObject(
    EDITABLE_LIST_TRANSLATION
  );

  @Output() changed: EventEmitter<EditableListState> = new EventEmitter<
    EditableListState
  >();

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly order = ListSortType;

  public listState: EditableListState = {
    delete: [],
    create: [],
    order: null,
    sortType: null,
    list: null,
  };

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        list: [],
        allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
        translation: cloneObject(EDITABLE_LIST_TRANSLATION),
      },
      []
    );

    if (hasChanges(changes, ['list'])) {
      this.listState.list = cloneDeep(this.list);
      this.listState.sortType = this.getListSortType(this.listState.list);
    }

    if (hasChanges(changes, ['sortType'])) {
      this.listState.sortType = this.sortList(
        this.listState.list,
        this.sortType,
        this.listState.sortType
      );
      this.transmit();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ////// -----------------------------------------------

  public addItem(): void {
    this.srvc.addItem(
      this.listState.list,
      this.allowedActions,
      this.translation
    );

    // this.listState.sortType = ListSortType.UserDefined;
    this.cd.detectChanges();
  }

  public removeItem(
    id: string | number,
    confirm: boolean = null,
    list: SelectOption[] = this.listState.list
  ) {
    this.cd.detectChanges();
  }

  ////// -----------------------------------------------

  public onItemMove(dropResult: DropResult) {
    if (this.srvc.onItemMove(this.listState.list, dropResult)) {
      this.listState.sortType = ListSortType.UserDefined;
      this.transmit();
    }
  }

  public sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder = this.listState.sortType
  ): ListSortType {
    if (order === ListSortType.UserDefined) {
      return ListSortType.UserDefined;
    }

    arrOfObjSortByProp(
      list,
      'value',
      order === ListSortType.Asc || currentOrder !== ListSortType.Asc
    );

    return order === ListSortType.Asc ||
      currentOrder === ListSortType.Desc ||
      currentOrder === ListSortType.UserDefined
      ? ListSortType.Asc
      : ListSortType.Desc;
  }

  private transmit(): void {
    this.listState.order = this.listState.list.map(i => i.value);
    this.listState.list = cloneArray(this.listState.list);

    const itersection = this.listState.create.filter(i =>
      this.listState.delete.includes(i)
    );

    if (isNotEmptyArray(itersection)) {
      this.listState.create = this.listState.create.filter(
        i => !itersection.includes(i)
      );
      this.listState.delete = this.listState.delete.filter(
        i => !itersection.includes(i)
      );
    }

    this.changed.emit(cloneObject(this.listState));
  }

  public listTrackBy(index: number, item: SelectOption): string | number {
    return item.id || item.value || JSON.stringify(item);
  }

  private isListAscending(list: SelectOption[] = this.listState.list): boolean {
    return !list.find((itm, indx) => list[indx].value > list[indx + 1].value);
  }

  private isListDescending(
    list: SelectOption[] = this.listState.list
  ): boolean {
    return !list.find((itm, indx) => list[indx].value < list[indx + 1].value);
  }

  private getListSortType(
    list: SelectOption[] = this.listState.list
  ): ListSortType {
    return this.isListAscending(list)
      ? ListSortType.Asc
      : this.isListDescending(list)
      ? ListSortType.Desc
      : ListSortType.UserDefined;
  }
}
