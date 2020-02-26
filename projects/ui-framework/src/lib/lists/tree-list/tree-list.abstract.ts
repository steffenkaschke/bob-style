import {
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  ViewChild,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { SearchComponent } from '../../search/search/search.component';
import {
  cloneDeepSimpleObject,
  applyChanges,
  hasChanges,
  firstChanges,
  notFirstChanges,
  isNotEmptyArray,
  objectHasTruthyValue,
  isBoolean,
  arrayDifference,
  isEmptyArray,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { SelectType } from '../list.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import {
  TreeListComponentIO,
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
  TreeListItem,
} from './tree-list.interface';
import { TreeListViewService } from './services/tree-list-view.service';
import { TreeListModelService } from './services/tree-list-model.service';
import { TreeListControlsService } from './services/tree-list-controls.service';

import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from './tree-list.const';
import { LIST_ACTIONS_STATE_DEF } from '../list-footer/list-footer.const';

export abstract class BaseTreeListElement
  implements TreeListComponentIO, OnChanges, AfterViewInit, OnDestroy {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected viewSrvc: TreeListViewService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected host: ElementRef
  ) {}

  @ViewChild('search', { static: false, read: SearchComponent })
  protected search: SearchComponent;
  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;
  // @ViewChildren('itemElements') protected itemElements: QueryList<ElementRef>;
  @ViewChild('footer', { static: false, read: ElementRef })
  protected footer: ElementRef;

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input('value') set setValue(value: itemID[]) {}
  public value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = ' / ';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = true;
  @Input() startCollapsed = true;
  @Input() focusOnInit = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: false,
    cancel: false,
    clear: false,
    reset: false,
  };

  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('hidden') @Input() hidden = true;
  @HostBinding('attr.data-debug') @Input() debug = false;

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  public searchValue = '';
  protected minSearchLength = 1;
  public showSearch = false;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];
  readonly selectType = SelectType;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('---------------', 'Tree LIST ngOnChanges', changes);

    console.time('ngOnChanges');
    let viewModelWasUpdated = false;

    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list', 'value'],
      false,
      { list: 'setList', value: 'setValue' }
    );

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (
      (hasChanges(changes, ['list'], true) &&
        changes.list.currentValue !== this.list) ||
      hasChanges(changes, ['showSingleGroupHeader'])
    ) {
      if (changes.list) {
        this.list = changes.list.currentValue;
        this.hidden = !this.list.length;
      }

      if (
        !this.showSingleGroupHeader &&
        isNotEmptyArray(this.list, 1) &&
        this.list[0][this.keyMap.children]
      ) {
        this.list = this.list[0][this.keyMap.children];
      }

      console.time('getListItemsMap');
      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });
      console.timeEnd('getListItemsMap');

      this.showSearch = this.itemsMap.size > 10;
    }

    if (hasChanges(changes, ['value'])) {
      console.log('LIST CHNGES VALUE', changes.value.currentValue);
    }

    if (hasChanges(changes, ['list'], true) || hasChanges(changes, ['value'])) {
      if (firstChanges(changes, ['list'])) {
        this.updateListViewModel();
        viewModelWasUpdated = true;
      }

      viewModelWasUpdated =
        this.applyValue(
          changes.value ? changes.value.currentValue : this.value
        ) || viewModelWasUpdated;
    }

    if (
      notFirstChanges(changes, ['startCollapsed']) &&
      typeof this.startCollapsed === 'boolean'
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (hasChanges(changes, ['valueDefault'], true)) {
      const defaultsExist = isNotEmptyArray(this.valueDefault);
      this.listActions.clear = !defaultsExist;
      this.listActions.reset = defaultsExist;
    }

    if (
      hasChanges(changes, ['list', 'valueDefault'], true) ||
      hasChanges(changes, ['showSingleGroupHeader', 'value'])
    ) {
      this.updateActionButtonsState();
    }

    if (
      notFirstChanges(changes, ['type']) &&
      this.type !== SelectType.multi &&
      isNotEmptyArray(this.value)
    ) {
      this.modelSrvc.deselectAllItemsInMap(this.itemsMap);
    }

    if (
      !viewModelWasUpdated &&
      (hasChanges(changes, ['list', 'viewFilter'], true) ||
        hasChanges(changes, [
          'value',
          'startCollapsed',
          'showSingleGroupHeader',
        ]))
    ) {
      this.updateListViewModel();
    }

    if (hasChanges(changes, ['maxHeightItems', 'list'], true)) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': Math.max(
          this.itemsMap.size > 0
            ? this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3
            : 0,
          this.maxHeightItems
        ),
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('ngOnChanges');
  }

  // -----------------------------------

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          (!this.readonly && objectHasTruthyValue(this.listActions)) ||
          !(this.footer && this.DOM.isEmpty(this.footer.nativeElement));

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

        if (this.focusOnInit && this.search) {
          this.search.input.nativeElement.focus();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.itemsMap.clear();
  }

  public onListClick(event: MouseEvent): void {
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      itemClick: this.itemClick.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
    });
  }

  public onListKeyDown(event: KeyboardEvent) {
    this.cntrlsSrvc.onListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
    });
  }

  public toggleCollapseAll(force: boolean = null, updateModel = true): void {
    this.modelSrvc.toggleCollapseAllItemsInMap(this.itemsMap, force);
    if (updateModel) {
      this.updateListViewModel();
    }
  }

  public searchChange(value: string) {
    const newSearchValue = value.length > this.minSearchLength ? value : '';

    if (newSearchValue !== this.searchValue) {
      this.searchValue = newSearchValue;

      this.viewFilter = this.searchValue
        ? this.modelSrvc.getSearchViewFilter(this.searchValue)
        : undefined;

      this.updateListViewModel(true);
    }
  }

  public clearList(): void {
    this.applyValue(null);
    this.updateActionButtonsState(true);
    this.cd.detectChanges();
    this.emitChange();
  }

  public resetList(): void {
    this.applyValue(this.valueDefault);
    this.updateActionButtonsState(null, true);
    this.cd.detectChanges();
    this.emitChange();
  }

  public onApply(): void {
    if (this.apply.observers.length > 0) {
      this.apply.emit();
    }
    this.listActionsState.apply.disabled = true;
  }

  public onCancel(): void {
    if (this.cancel.observers.length > 0) {
      this.cancel.emit();
    }
  }

  protected updateActionButtonsState(
    forceClearHidden: boolean = null,
    forceResetHidden: boolean = null
  ): void {
    this.listActionsState.clear.hidden = isBoolean(forceClearHidden)
      ? forceClearHidden
      : isEmptyArray(this.value);
    this.listActionsState.reset.hidden = isBoolean(forceResetHidden)
      ? forceResetHidden
      : isEmptyArray(this.value) ||
        isEmptyArray(this.valueDefault) ||
        !arrayDifference(this.value, this.valueDefault).length;
  }

  public showCheckbox(item: TreeListItem): boolean {
    return this.type === SelectType.multi && !this.readonly && !this.disabled;
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  // Placeholder methods

  protected updateListViewModel(expand = false): void {}

  protected applyValue(newValue: itemID[]): any {}

  protected emitChange(): void {}

  protected toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement
  ): void {}

  protected itemClick(item: TreeListItem, element: HTMLElement): void {}

  protected toggleItemSelect(
    item: TreeListItem,
    force: boolean = null,
    set: Partial<TreeListItem> = {}
  ): void {}

  // Dev / Debug

  log(what = 'Data') {
    switch (what) {
      case 'Data':
        console.log('---------CMPNT---------\n', this);
        console.log('---------LIST---------\n', this.list);
        console.log('---------MAP---------\n', this.itemsMap);
        console.log('---------VIEWMODEL---------\n', this.listViewModel);
        break;

      case 'ValuesMap':
        console.log(
          '------------------\n',
          'IDs to Values map:\n',
          this.modelSrvc.getIDtoValueMap(this.list, this.keyMap)
        );
        break;

      case 'ViewContext':
        console.log(
          '------------------\n',
          'Items view context:\n',
          this.listViewModel.map(id => {
            const item = this.itemsMap.get(id);
            return {
              id: item.id,
              collapsed: item.collapsed,
              parentCount: item.parentCount,
              childrenCount: item.childrenCount,
              groupsCount: item.groupsCount,
              selectedCount: item.selectedCount,
              allOptionsHidden: item.allOptionsHidden,
              nextInViewIsGroup: item.nextInViewIsGroup,
            };
          })
        );
        break;

      case 'Value':
        console.log('---------VALUE---------\n', this.value);
        break;
    }
  }
}
