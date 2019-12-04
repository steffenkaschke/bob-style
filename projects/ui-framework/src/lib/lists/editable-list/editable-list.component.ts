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
  hasChanges,
  isNotEmptyArray,
  cloneArray,
} from '../../services/utils/functional-utils';
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

  public isDragged = false;
  public removingIndex: number;

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
      this.listState.sortType = this.srvc.getListSortType(this.listState.list);
    }

    if (hasChanges(changes, ['sortType'])) {
      this.sortList(
        this.listState.list,
        this.sortType,
        this.listState.sortType
      );
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
    index: number,
    confirm = false,
    list: SelectOption[] = this.listState.list
  ) {
    if (index > -1) {
      if (!confirm) {
        this.removingIndex = index;
      } else {
        this.listState.delete.push(list[index].value);
        list.splice(index, 1);
        this.transmit();
        this.removingIndex = null;
      }
    }

    this.cd.detectChanges();
  }

  ////// -----------------------------------------------

  public onDrop(dropResult: DropResult) {
    this.isDragged = false;
    if (this.srvc.onDrop(this.listState.list, dropResult)) {
      this.listState.sortType = ListSortType.UserDefined;
      this.transmit();
    }
  }

  public onDragStart() {
    this.isDragged = true;
  }

  sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder: ListSortType = this.listState.sortType
  ) {
    this.listState.sortType = this.srvc.sortList(list, order, currentOrder);
    this.transmit();
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
}
