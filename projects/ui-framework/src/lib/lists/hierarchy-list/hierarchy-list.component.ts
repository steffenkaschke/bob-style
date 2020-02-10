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
} from '@angular/core';
import {
  HierarchyListItemMap,
  itemID,
  HierarchyListItem,
  ViewFilter,
  HierarchyListValue,
  HierarchyListOption,
} from './hierarchy-list.interface';
import { HierarchyListService } from './hierarchy-list.service';
import { SelectType } from '../list.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import {
  applyChanges,
  stringToRegex,
  objectHasTruthyValue,
  hasChanges,
} from '../../services/utils/functional-utils';
import { BehaviorSubject } from 'rxjs';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyListComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private srvc: HierarchyListService,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  @ViewChild('footer', { static: false, read: ElementRef })
  private footer: ElementRef;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = false;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() listActions: ListFooterActions = {
    clear: true,
    reset: false,
    apply: true,
  };

  @Input() list: HierarchyListOption[];
  @Input() value: itemID[];
  @Input() viewFilter: ViewFilter;

  @Output() changed: EventEmitter<HierarchyListValue> = new EventEmitter<
    HierarchyListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.data-embedded') @Input() public embedded = false;

  public searchValue = '';
  public showSearch = true;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = {
    clear: { disabled: false, hidden: true },
    reset: { disabled: false, hidden: true },
    apply: { disabled: true, hidden: false },
  };
  public itemsMap: HierarchyListItemMap = new Map();
  public listView$ = new BehaviorSubject<itemID[]>([]);

  readonly selectType = SelectType;

  ngOnChanges(changes: SimpleChanges): void {
    // applyChanges(this, changes, {
    //   list: [],
    // });

    // re-apply value after list/map ngOnChanges

    // console.log('=====ngOnChanges start=======');

    if (changes.list) {
      // console.log(this.list);

      this.srvc.getListItemsMap(
        this.list,
        this.itemsMap,
        this.valueSeparatorChar,
        this.startCollapsed
      );

      // const view = this.srvc.getListViewModel(this.list, this.itemsMap);

      // console.log(view);

      this.updateListViewModel();
    }

    if (
      hasChanges(changes, [
        'options',
        'showSingleGroupHeader',
        'optionsDefault',
      ])
    ) {
      this.updateActionButtonsState();
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }

    // console.log('=====ngOnChanges end=======');
  }

  ngOnInit() {
    // console.time('getListItemsMap');
    // console.log('LIST', this.list);
    // console.log('MAP', this.itemsMap);
    // console.timeEnd('getListItemsMap');
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

  private updateListViewModel() {
    this.listView$.next(
      this.srvc.getListViewModel(
        this.list,
        this.itemsMap,
        this.searchValue ? this.srvc.getSearchViewFilter(this.searchValue) : {},
        !!this.searchValue
      )
    );
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

  public toggleCollapseAll() {}

  public itemClick(item: HierarchyListItem): void {
    if (item.childrenCount) {
      this.toggleItemCollapsed(item);
    } else if (!this.readonly) {
      this.toggleItemSelect(item);
    }

    this.updateActionButtonsState();
  }

  public toggleItemCollapsed(item: HierarchyListItem): void {
    item.collapsed = !item.collapsed;
    this.updateListViewModel();
  }

  public toggleItemSelect(item: HierarchyListItem): void {
    if (!item.disabled && !this.readonly) {
      item.selected = !item.selected;

      for (const parenID of item.parentIDs) {
        const parent = this.itemsMap.get(parenID);
        parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

        parent.selected = parent.selectedCount === parent.childrenCount;

        parent.indeterminate = !parent.selected && !!parent.selectedCount;
      }
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

  public isParentCollapsed(item: HierarchyListItem): boolean {
    return Boolean(
      item.parentCount &&
        this.itemsMap.get(item.parentIDs[item.parentCount - 1]).collapsed
    );
  }

  public showCheckbox(item: HierarchyListItem): boolean {
    return (
      this.type === SelectType.multi && !this.readonly && !this.searchValue
    );
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  public getChevronIcon(item: HierarchyListItem, index: number): string {
    return !item.childrenIDs
      ? null
      : item.childrenIDs.includes(this.listView$.getValue()[index + 1])
      ? 'chevron-down'
      : 'chevron-right';
  }

  log() {
    console.log(this.itemsMap);
    console.log(this.listView$.getValue());
  }
}
