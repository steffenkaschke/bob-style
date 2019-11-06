import {
  AfterViewInit,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import {
  ListHeader,
  ListOption,
  ListFooterActions,
  SelectGroupOption
} from './list.interface';
import find from 'lodash/find';
import { LIST_EL_HEIGHT } from './list.consts';
import { ListKeyboardService } from './list-service/list-keyboard.service';
import { Keys } from '../../enums';
import { ListChange } from './list-change/list-change';

export abstract class BaseListElement
  implements OnInit, OnDestroy, AfterViewInit {
  protected constructor(
    private renderer: Renderer2,
    private listKeyboardService: ListKeyboardService,
    protected cd: ChangeDetectorRef
  ) {}

  @ViewChild('vScroll', { static: true }) vScroll: CdkVirtualScrollViewport;
  @ViewChild('headers', { static: false }) headers;

  public noGroupHeaders: boolean;
  public focusOption: ListOption;
  public listOptions: ListOption[];
  public listHeaders: ListHeader[];
  public focusIndex: number;
  public searchValue: string;
  public shouldDisplaySearch = false;

  private keyDownSubscriber: Subscription;
  public filteredOptions: SelectGroupOption[];

  readonly listElHeight = LIST_EL_HEIGHT;

  @Input() options: SelectGroupOption[];
  @Input() listActions: ListFooterActions;
  @Input() maxHeight = this.listElHeight * 8;
  @Input() showSingleGroupHeader = false;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() apply: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.focusIndex = -1;
    this.keyDownSubscriber = this.listKeyboardService
      .getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        switch (e.key) {
          case Keys.arrowdown:
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
                    groupName: this.focusOption.groupName
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
  }

  optionClick(option: ListOption): void {}

  headerClick(header: ListHeader): void {}
}
