import {
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ConnectedPosition
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import invoke from 'lodash/invoke';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseFormElement } from '../base-form-element';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { isEqual } from 'lodash';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { OverlayPositionClasses } from '../../types';
import { UtilsService } from '../../services/utils/utils.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { isKey, hasChanges } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { SelectGroupOption } from './list.interface';
import { ListChange } from './list-change/list-change';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';

export abstract class BaseSelectPanelElement extends BaseFormElement
  implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild('prefix', { static: false }) prefix: ElementRef;

  @Input() options: SelectGroupOption[];
  @Input() panelClass: string;
  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;
  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input('hasArrow') set setPanelArrowClass(hasArrow: boolean) {
    if (hasArrow === false) {
      this.panelClassList =
        hasArrow === false
          ? (this.panelClassList = this.panelClassList.filter(
              c => c !== 'b-select-panel-with-arrow'
            ))
          : hasArrow === true
          ? [...(this.panelClassList || []), 'b-select-panel-with-arrow']
          : this.panelClassList || [];
    }
  }

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  showPrefix = true;
  positionClassList: OverlayPositionClasses = {};
  panelOpen = false;
  triggerValue: any;
  panelClassList: string[] = [];

  private panelConfig: OverlayConfig;
  public overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  private backdropClickSubscriber: Subscription;
  private positionChangeSubscriber: Subscription;
  private windowKeydownSubscriber: Subscription;
  readonly tooltipType = TruncateTooltipType;

  protected constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    protected utilsService: UtilsService,
    public DOM: DOMhelpers,
    protected zone: NgZone,
    public cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
      this.destroyPanel();
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.showPrefix =
          this.prefix && !this.DOM.isEmpty(this.prefix.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  openPanel(): void {
    if (!this.overlayRef && !this.disabled) {
      this.panelOpen = true;
      this.panelConfig = this.getDefaultConfig();
      this.overlayRef = this.overlay.create(this.panelConfig);
      this.templatePortal = new TemplatePortal(
        this.templateRef,
        this.viewContainerRef
      );
      this.overlayRef.attach(this.templatePortal);

      this.overlayRef.updatePosition();
      this.overlayRef.updateSize({
        width: this.overlayOrigin.elementRef.nativeElement.offsetWidth
      });

      const searchInput = this.overlayRef.overlayElement.querySelector(
        'b-search .bfe-input'
      ) as HTMLElement;
      if (searchInput) {
        searchInput.focus();
      }

      this.opened.emit(this.overlayRef);

      this.backdropClickSubscriber = this.overlayRef
        .backdropClick()
        .subscribe(() => {
          this.onCancel();
        });

      this.windowKeydownSubscriber = this.utilsService
        .getWindowKeydownEvent()
        .pipe(
          outsideZone(this.zone),
          filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
        )
        .subscribe(() => {
          this.destroyPanel();
        });
    }
  }

  closePanel(): void {
    this.destroyPanel();
  }

  protected onCancel(): void {
    this.destroyPanel();
  }

  protected destroyPanel(): void {
    this.panelOpen = false;
    if (this.overlayRef) {
      invoke(this.overlayRef, 'dispose');
      invoke(this.backdropClickSubscriber, 'unsubscribe');
      invoke(this.positionChangeSubscriber, 'unsubscribe');
      invoke(this.windowKeydownSubscriber, 'unsubscribe');
      this.panelConfig = {};
      this.templatePortal = null;
      this.overlayRef = null;
      this.closed.emit();
    }
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getPanelClass(): string[] {
    return [
      ...this.panelClassList,
      'b-select-panel',
      this.panelClass,
      this.isQuickFilter ? 'b-quick-filter-panel' : null
    ].filter(Boolean);
  }

  private getDefaultConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getPanelPositionStrategy(
      this.overlayOrigin,
      this.panelPosition
    );

    this.subscribeToPositions(
      positionStrategy as FlexibleConnectedPositionStrategy
    );

    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: this.getPanelClass(),
      positionStrategy,
      scrollStrategy: this.panelPositionService.getScrollStrategy()
    };
  }

  private subscribeToPositions(
    positionStrategy: FlexibleConnectedPositionStrategy
  ): void {
    this.positionChangeSubscriber = positionStrategy.positionChanges
      .pipe(distinctUntilChanged(isEqual))
      .subscribe(change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(
          change
        ) as OverlayPositionClasses;

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
          this.overlayRef.overlayElement.children[0].className = this
            .positionClassList['panel-above']
            ? 'b-select-panel panel-above'
            : 'b-select-panel panel-below';
        }
      });
  }
}
