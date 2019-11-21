import {
  AfterViewInit,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import {
  ListHeader,
  ListOption,
  ListFooterActions,
  SelectGroupOption,
  ListFooterActionsState,
} from './list.interface';
import find from 'lodash/find';
import { LIST_EL_HEIGHT } from './list.consts';
import { ListKeyboardService } from './list-service/list-keyboard.service';
import { Keys } from '../enums';
import { ListChange } from './list-change/list-change';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import {
  objectHasTruthyValue,
  applyChanges,
  isNotEmptyArray,
  getEventPath,
} from '../services/utils/functional-utils';
import { ListModelService } from './list-service/list-model.service';
import { ListChangeService } from './list-change/list-change.service';

export abstract class BaseListElement
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  protected constructor(
    private renderer: Renderer2,
    private listKeyboardService: ListKeyboardService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected DOM: DOMhelpers,
    protected host: ElementRef
  ) {}

  @ViewChild('vScroll', { static: true }) vScroll: CdkVirtualScrollViewport;
  @ViewChild('headers', { static: false }) headers;
  @ViewChild('footer', { static: false, read: ElementRef })
  private footer: ElementRef;

  public noGroupHeaders: boolean;
  public focusOption: ListOption;
  public listOptions: ListOption[];
  public listHeaders: ListHeader[];
  public focusIndex: number;
  public searchValue: string;
  public shouldDisplaySearch = false;
  public filteredOptions: SelectGroupOption[];
  public listActionsState: ListFooterActionsState = {
    clear: { disabled: false, hidden: true },
    reset: { disabled: false, hidden: true },
    apply: { disabled: true, hidden: false },
  };
  public hasFooter = true;

  protected optionsDefaultIDs: (string | number)[];
  private keyDownSubscriber: Subscription;
  readonly listElHeight = LIST_EL_HEIGHT;

  @Input() options: SelectGroupOption[];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() listActions: ListFooterActions;
  @Input() maxHeight = this.listElHeight * 8;
  @Input() showSingleGroupHeader = false;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() apply: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.optionsDefault && isNotEmptyArray(this.optionsDefault)) {
      this.optionsDefaultIDs = this.listModelService.getSelectedIDs(
        this.optionsDefault
      );

      this.listActions.clear = false;
      this.listActions.reset =
        typeof this.listActions.reset === 'string'
          ? this.listActions.reset
          : true;
    }
  }

  ngOnInit(): void {
    this.focusIndex = -1;
    this.keyDownSubscriber = this.listKeyboardService
      .getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        if (!getEventPath(e).includes(this.host.nativeElement)) {
          return;
        }

        switch (e.key) {
          case Keys.arrowdown:
            e.preventDefault();
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowdown,
              this.focusIndex,
              this.listOptions.length
            );
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex(
                this.focusIndex,
                this.maxHeight
              )
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.arrowup:
            e.preventDefault();
            this.focusIndex = this.listKeyboardService.getNextFocusIndex(
              Keys.arrowup,
              this.focusIndex,
              this.listOptions.length
            );
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.listKeyboardService.getScrollToIndex(
                this.focusIndex,
                this.maxHeight
              )
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.enter:
            e.preventDefault();
            this.focusOption.isPlaceHolder
              ? this.headerClick(
                  find(this.listHeaders, {
                    groupName: this.focusOption.groupName,
                  })
                )
              : this.optionClick(this.focusOption);
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.keyDownSubscriber) {
      this.keyDownSubscriber.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (!this.noGroupHeaders) {
      this.renderer.insertBefore(
        this.vScroll.elementRef.nativeElement,
        this.headers.nativeElement,
        this.vScroll.elementRef.nativeElement.firstChild
      );
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          objectHasTruthyValue(this.listActions) ||
          !this.DOM.isEmpty(this.footer.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  optionClick(option: ListOption): void {}

  headerClick(header: ListHeader): void {}

  onClear(): void {
    this.clear.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onApply(): void {
    this.apply.emit();
  }

  isSameGroup(
    group1: Partial<SelectGroupOption> | Partial<ListHeader>,
    group2: Partial<SelectGroupOption> | Partial<ListHeader>
  ): boolean {
    return this.listModelService.isSameGroup(group1, group2);
  }
}
