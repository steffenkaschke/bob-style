import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../lists/list.consts';
import { ListFooterActions, SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { ListChange } from '../../lists/list-change/list-change';
import {
  applyChanges,
  cloneArray,
  hasChanges,
  isNotEmptyArray,
  simpleUID,
} from '../../services/utils/functional-utils';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import { TranslateService } from '@ngx-translate/core';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { SelectMode } from '../../lists/list.enum';
import { MULTI_LIST_LIST_ACTIONS_DEF } from '../../lists/list-footer/list-footer.const';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { BasicListComponent, BasicListItem, BasicListType, ButtonType, IconColor, Icons, MenuItem } from 'bob-style';

export enum RowActionType {
  menu = 'menu',
  icon = 'icon'
}

export interface ListViewConfig {
  rowStartIcon?: {
    isIcon: boolean;
    icon: Icons;
  };
  rowAction?: {
    isIcon: boolean;
    actionType: RowActionType;
    icon: Icons;
  };
}

export interface ListRow extends BasicListItem {
  icon?: Icons;
  actionIcon?: Icons;
  menu?: MenuItem[];
  id: number | string;
  disabled?: boolean;
}

@Component({
  selector: 'b-multi-list-and-list',
  templateUrl: './multi-list-and-list.component.html',
  styleUrls: ['./multi-list-and-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiListAndListComponent implements OnChanges, OnInit {
  constructor(
    private cd: ChangeDetectorRef,
    public host: ElementRef,
    private translate: TranslateService,
    private DOM: DOMhelpers,
  ) {
    this.listActions = { ...MULTI_LIST_LIST_ACTIONS_DEF };
  }

  readonly buttonType: ButtonType = ButtonType.tertiary;

  @Input() icon: Icons = Icons.three_dots;
  @Input() iconColor: IconColor;

  @ViewChild(MultiListComponent, { static: true }) list: MultiListComponent;
  @ViewChild(BasicListComponent, { static: true }) basicList: BasicListComponent;

  @Input() listLabel: string;
  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;
  @Input() listActions: ListFooterActions;
  @Input() mode: SelectMode = SelectMode.checkGroups;

  @Input() public type: BasicListType = BasicListType.primary;
  @Input() public showActionOnHover = false;
  @Input() public maxLines: number = null;

  @Input() public emptyStateConfig: EmptyStateConfig = { icon: Icons.three_dots };
  @Input() public listViewConfig: ListViewConfig = {
    rowStartIcon: {
      isIcon: false,
      icon: Icons.doc,
    },
    // rowAction: {
    //   isIcon: true,
    //   actionType: RowActionType.menu,
    //   icon: Icons.three_dots,
    // },
    rowAction: {
      isIcon: true,
      actionType: RowActionType.icon,
      icon: Icons.delete,
    },
  };

  @Input() min: number;
  @Input() max: number;

  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  public listOptions: SelectGroupOption[] = [];
  public selectedListOptions: ListRow[] = [];

  readonly listElHeight: number = LIST_EL_HEIGHT;

  readonly listID: string = simpleUID('mlacl-');

  ngOnInit(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--translation-all': `'(${this.translate.instant('common.all')})'`,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        options: [],
      },
      [],
      true,
    );

    if (hasChanges(changes, ['options'])) {
      this.options = this.listOptions =
        this.options?.filter((group: SelectGroupOption) =>
          isNotEmptyArray(group.options),
        ) || [];

      this.optionsToList(this.options);
      this.cd.detectChanges();
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onListChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.optionsToList(this.options);
    this.emitChange();
  }

  private optionsToList(options: SelectGroupOption[]): ListRow[] {
    const listItems: ListRow[] = [];
    options.forEach(optionGroup => optionGroup.options.forEach(op => {

      if (op.selected) {
        console.log(op);
        const option: ListRow = {
          id: op.id,
          label: [op.value],
          disabled: op.disabled,
        };
        // set row strong tag if any
        if (op.strongParent) {
          option.label = [`<strong>${optionGroup.groupName}</strong> - ${op.value}`];
        }
        // set sub value in any
        if (op.subValue) {
          option.label = [...option.label, op.subValue];
        } else {
          option.label = [...option.label, '  '];
        }
        // set row start icon if any
        if (this.listViewConfig.rowStartIcon?.isIcon && this.listViewConfig.rowStartIcon?.icon) {
          option.icon = this.listViewConfig.rowStartIcon.icon;
        }
        // set row action icon if any
        if (this.listViewConfig.rowAction.isIcon) {
          option.actionIcon = this.listViewConfig.rowAction.icon;
        }
        // set row menu icon if any
        if (this.listViewConfig.rowAction.actionType === RowActionType.menu) {
          option.menu = [
            {
              label: 'Edit',
            },
            {
              label: 'Delete',
            },
          ];
        }
        listItems.push(option);
      }
    }));

    this.selectedListOptions = listItems;
    return this.selectedListOptions;
  }

  public onListRowRemove(item: ListRow) {
    this.listOptions = this.removeItemFromOption(item);
    this.emitChange();
  }

  private removeItemFromOption(item: ListRow) {
    const options: SelectGroupOption[] = cloneArray(this.options);
    options.find((group: SelectGroupOption) => {
      const opt = group.options.find((o: SelectOption) => o.id === item.id);
      if (opt) {
        opt.selected = false;
      }
    });
    this.selectedListOptions = this.selectedListOptions.filter((listOp: any) => listOp.id !== item.id);
    return (this.options = options);
  }

  private emitChange(): void {
    this.selectChange.emit(new ListChange(this.listOptions));
  }

}
