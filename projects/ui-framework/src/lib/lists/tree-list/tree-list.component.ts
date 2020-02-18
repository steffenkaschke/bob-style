import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  TreeListItemMap,
  itemID,
  TreeListItem,
  ViewFilter,
  TreeListValue,
  TreeListOption,
} from './tree-list.interface';
import { TreeListService } from './services/tree-list.service';
import { SelectType } from '../list.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import {
  objectHasTruthyValue,
  hasChanges,
  cloneDeepSimpleObject,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { LIST_ACTIONS_STATE_DEF } from '../list-footer/list-footer.const';
import { TreeListControlsService } from './services/tree-list-controls.service';

@Component({
  selector: 'b-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private srvc: TreeListService,
    private cntrlsSrvc: TreeListControlsService,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private host: ElementRef
  ) {}

  @ViewChild('footer', { static: false, read: ElementRef })
  private footer: ElementRef;
  @ViewChild('listElement', { static: false, read: ElementRef })
  private listElement: ElementRef;
  @ViewChildren('itemElements') private itemElements: QueryList<ElementRef>;

  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() viewFilter: ViewFilter;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  // @Input() maxWidth = 8;
  @Input() showSingleGroupHeader = false;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: true,
    cancel: true,
    clear: true,
    reset: false,
  };

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.data-embedded') @Input() public embedded = false;

  public searchValue = '';
  public showSearch = false;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];
  readonly selectType = SelectType;

  ngOnChanges(changes: SimpleChanges): void {
    // applyChanges(this, changes, {
    //   list: [],
    // });

    // re-apply value after list/map ngOnChanges

    // console.log('=====ngOnChanges start=======');

    if (changes.list) {
      // console.log(this.list);

      console.log('changes.list');

      this.srvc.getListItemsMap(
        this.list,
        this.itemsMap,
        this.valueSeparatorChar,
        this.startCollapsed
      );

      this.showSearch = this.itemsMap.size > 10;

      this.updateListViewModel();
    }

    // if (changes.startCollapsed) {
    //   this.updateListViewModel(!this.startCollapsed, this.startCollapsed);
    // }

    if (
      hasChanges(changes, ['startCollapsed']) &&
      typeof this.startCollapsed === 'boolean'
    ) {
      this.toggleCollapseAll(this.startCollapsed);
    }

    // if (
    //   hasChanges(changes, [
    //     'options',
    //     'showSingleGroupHeader',
    //     'optionsDefault',
    //   ])
    // ) {
    //   this.updateActionButtonsState();
    // }

    if (hasChanges(changes, ['maxHeightItems'])) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': this.maxHeightItems,
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }

    // console.log('=====ngOnChanges end=======');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          (!this.readonly && objectHasTruthyValue(this.listActions)) ||
          !this.DOM.isEmpty(this.footer.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
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
    });
  }

  public onListKeyDown(event: KeyboardEvent) {
    this.cntrlsSrvc.onListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
    });
  }

  private updateListViewModel() {
    this.listViewModel = this.srvc.getListViewModel(
      this.list,
      this.itemsMap,
      this.searchValue ? this.srvc.getSearchViewFilter(this.searchValue) : {},
      !!this.searchValue
    );
    this.cd.detectChanges();
  }

  public searchChange(value: string) {
    const newSearchValue = value.length > 1 ? value : '';

    if (newSearchValue !== this.searchValue) {
      this.searchValue = newSearchValue;

      if (this.searchValue === '') {
      }

      this.updateListViewModel();
    }
  }

  public toggleCollapseAll(force = null): void {
    for (const item of this.itemsMap.values()) {
      item.collapsed = force !== null ? force : !item.collapsed;
    }
    this.updateListViewModel();
  }

  public itemClick(item: TreeListItem, index: number): void {
    if (item.childrenCount) {
      this.toggleItemCollapsed(item, index);
    } else if (!this.readonly) {
      this.toggleItemSelect(item, index);
    }

    this.updateActionButtonsState();
  }

  public toggleItemCollapsed(item: TreeListItem, index: number): void {
    let element: HTMLElement, elOffset: number;

    if (!item.collapsed) {
      element = this.itemElements.toArray()[index].nativeElement;
      elOffset = element.offsetTop;
    }

    item.collapsed = !item.collapsed;
    // this.cd.detectChanges();
    this.updateListViewModel();

    if (item.collapsed) {
      console.log('was closed');
      // element = this.itemElements.toArray()[index].nativeElement;
      // elOffset = element.offsetTop;
      console.log(this.listElement.nativeElement.scrollTop);
      this.cd.detectChanges();

      this.listElement.nativeElement.scrollTop =
        this.listElement.nativeElement.scrollTop -
        (elOffset - element.offsetTop);
      // this.listElement.nativeElement.scrollTop = index * LIST_EL_HEIGHT;
      console.log(this.listElement.nativeElement.scrollTop);
    }

    // this.updateListViewModel();
  }

  public toggleItemSelect(item: TreeListItem, index: number): void {
    if (!item.disabled && !this.readonly) {
      item.selected = !item.selected;

      for (const parenID of item.parentIDs) {
        const parent = this.itemsMap.get(parenID);
        parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

        parent.selected = parent.selectedCount === parent.childrenCount;

        parent.indeterminate = !parent.selected && !!parent.selectedCount;
      }

      this.cd.detectChanges();
    }
  }

  public clearList(): void {
    this.updateActionButtonsState();
  }

  public resetList(): void {}

  public onApply(): void {
    this.apply.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private emitChange(): void {}

  protected updateActionButtonsState(
    forceClear: boolean = null,
    forceReset: boolean = null
  ) {
    // this.listActionsState.clear.hidden =
    //   forceClear !== null
    //     ? forceClear
    //     : !this.selectedIDs || this.selectedIDs.length === 0;
    // this.listActionsState.reset.hidden =
    //   forceReset !== null
    //     ? forceReset
    //     : !this.selectedIDs ||
    //       !this.optionsDefaultIDs ||
    //       isEqual(this.selectedIDs.sort(), this.optionsDefaultIDs.sort());
  }

  public isParentCollapsed(item: TreeListItem): boolean {
    return Boolean(
      item.parentCount &&
        this.itemsMap.get(item.parentIDs[item.parentCount - 1]).collapsed
    );
  }

  // public isExpanded(item: TreeListItem): boolean {
  //   return Boolean(
  //     item.childrenCount &&
  //       this.itemsMap.get(item.parentIDs[item.parentCount - 1]).collapsed
  //   );
  // }

  public showCheckbox(item: TreeListItem): boolean {
    return (
      this.type === SelectType.multi && !this.readonly && !this.searchValue
    );
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  log() {
    console.log('---------LIST---------\n', this.list);
    console.log('---------MAP---------\n', this.itemsMap);
    // console.log('---------VIEWMODEL---------\n', this.listView$.getValue());
    console.log('---------VIEWMODEL---------\n', this.listViewModel);
  }
}
