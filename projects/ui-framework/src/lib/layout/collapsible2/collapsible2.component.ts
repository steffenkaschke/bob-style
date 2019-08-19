import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterContentInit,
  SimpleChanges,
  OnChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CollapsibleType } from './collapsible2.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { simpleUID } from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { collapsibleOptionsDef } from './collapsible2.const';
import { CollapsibleOptions } from './collapsible2.interface';

@Component({
  selector: 'b-collapsible2',
  templateUrl: './collapsible2.component.html',
  styleUrls: ['./collapsible2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Collapsible2Component
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  public panelID = simpleUID('bcp-');
  public hasHeaderContent = true;
  public hasPanelContent = true;
  public contentLoaded = false;
  private contentHeight = 0;
  private resizeSubscription: Subscription;

  @Input() collapsible = false;

  @Input() expanded = false;
  @Input() disabled = false;

  @Input() title: string;
  @Input() description?: string;

  @Input() options: CollapsibleOptions = collapsibleOptionsDef;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('headerContent', { static: false }) headerContent: ElementRef;
  @ViewChild('panelContent', { static: false }) panelContent: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.options = {
        ...collapsibleOptionsDef,
        ...changes.options.currentValue
      };
    }
    if (changes.expanded && !changes.expanded.firstChange) {
      this.togglePanel(changes.expanded.currentValue);
    }
  }

  ngOnInit(): void {
    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        if (this.collapsible) {
          this.setCssVars();
        }
      });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasHeaderContent = !this.DOM.isEmpty(
          this.headerContent.nativeElement
        );
        this.hasPanelContent = !this.DOM.isEmpty(
          this.panelContent.nativeElement
        );
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  togglePanel(state = null): void {
    if (this.collapsible && this.hasPanelContent && !this.disabled) {
      this.contentLoaded = true;
      this.cd.detectChanges();

      if (!this.contentHeight) {
        this.setCssVars();
      }

      this.zone.run(() => {
        this.expanded = typeof state === 'boolean' ? state : !this.expanded;
        this.emitEvent();
      });
    }
  }

  setCssVars(): void {
    if (this.panelContent) {
      this.contentHeight = this.panelContent.nativeElement.scrollHeight;
      this.DOM.setCssProps(this.host.nativeElement, {
        '--panel-height': this.contentHeight + 'px'
      });
    }
  }

  emitEvent(): void {
    if (this.expanded) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }
}
