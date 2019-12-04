import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  NgZone,
  HostListener,
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
  isKey,
  isNumber,
} from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import {
  EDITABLE_LIST_TRANSLATION,
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
} from './editable-list.const';
import { ListSortType } from './editable-list.enum';
import { EditableListService } from './editable-list.service';
import { Keys } from '../../enums';
import { DOMInputEvent } from '../../types';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent implements OnChanges {
  constructor(
    private srvc: EditableListService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('addItemInput', { static: false }) addItemInput: ElementRef;

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
  public removingIndex: number = null;
  public addingItem = false;
  public addedItem = false;
  public inpuFocused = false;

  @HostListener('keydown.outside-zone', ['$event'])
  private onHostKeydown(event: KeyboardEvent) {
    if (isKey(event.key, Keys.escape) && isNumber(this.removingIndex)) {
      this.removeCancel();
    }
    if (isKey(event.key, Keys.enter) && isNumber(this.removingIndex)) {
      this.removeItem(this.removingIndex, true);
    }

    if (
      this.addingItem &&
      (isKey(event.key, Keys.enter) || isKey(event.key, Keys.tab))
    ) {
      this.addItem(true);
    }
    if (this.addingItem && isKey(event.key, Keys.escape)) {
      this.addItemCancel();
    }
  }

  @HostListener('focusout.outside-zone', ['$event'])
  private onHostFocusout(event: FocusEvent) {
    if (isNumber(this.removingIndex)) {
      this.removeCancel(event);
    }

    if (this.addingItem) {
      this.addItemCancel(event);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    applyChanges(this, changes, {
      list: [],
      allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
      translation: cloneObject(EDITABLE_LIST_TRANSLATION),
    });

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

  public addItem(confirm = false): void {
    if (!confirm) {
      this.addingItem = true;

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.addItemInput.nativeElement.focus();
          this.inpuFocused = true;

          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }, 0);
      });
    } else {
      const value = this.addItemInput.nativeElement.value;

      if (value.trim()) {
        this.addedItem = true;
        this.srvc.addItem(this.listState.list, value);
        this.listState.create.push(value);
        this.transmit();
        this.listState.sortType = ListSortType.UserDefined;
        this.inpuFocused = false;
        this.addingItem = false;
        this.addItemInput.nativeElement.value = '';
      } else {
        this.addItemCancel();
      }
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public addItemCancel(event: FocusEvent = null) {
    const relatedTarget = event && (event.relatedTarget as HTMLElement);

    if (
      !relatedTarget ||
      !relatedTarget.matches(
        '.bel-done-button button, .bel-item-confirm, .bel-item-input'
      )
    ) {
      this.inpuFocused = false;
      this.addingItem = false;

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }

    if (relatedTarget && relatedTarget.matches('.bel-item-confirm')) {
      this.addItemInput.nativeElement.focus();
    }

    if (
      !event ||
      (relatedTarget && relatedTarget.matches('.bel-cancel-button button'))
    ) {
      this.addItemInput.nativeElement.value = '';
    }
  }

  public removeItem(index: number, confirm = false): void {
    if (!confirm) {
      this.removingIndex = index;
    } else {
      this.listState.delete.push(this.listState.list[index].value);
      this.listState.list.splice(index, 1);
      this.transmit();
      this.removingIndex = null;
      this.addedItem = false;
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public removeCancel(event: FocusEvent = null): void {
    const relatedTarget = event && (event.relatedTarget as HTMLElement);

    if (!relatedTarget || !relatedTarget.matches('.bel-remove-button button')) {
      this.removingIndex = null;

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }
  }

  public onInputChange(event: DOMInputEvent): void {
    const value = event.target.value;
    console.log('onAddItemInputChange', value);
  }

  public onDragStart(): void {
    this.isDragged = true;
    this.addedItem = false;
  }

  public onDrop(dropResult: DropResult): void {
    this.isDragged = false;
    if (this.srvc.onDrop(this.listState.list, dropResult)) {
      this.listState.sortType = ListSortType.UserDefined;
      this.transmit();
    }
  }

  public sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder: ListSortType = this.listState.sortType
  ): void {
    this.listState.sortType = this.srvc.sortList(list, order, currentOrder);
    this.addedItem = false;
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
