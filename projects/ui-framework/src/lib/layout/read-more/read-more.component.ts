import {
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
  Component,
  NgZone,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  closestDivisable,
  simpleUID,
} from '../../services/utils/functional-utils';
import { Subscription, merge, Observable } from 'rxjs';
import { throttleTime, filter, take, skip, tap } from 'rxjs/operators';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { UtilsService } from '../../services/utils/utils.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputObservable } from '../../services/utils/decorators';
import {
  ReadMoreClickEvent,
  ReadMoreConfig,
  ReadMoreState,
  READ_MORE_CONFIG_DEF,
} from './read-more.interface';

@Component({
  selector: 'b-read-more',
  styleUrls: ['./read-more.component.scss'],
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
    <b-text-button
      *ngIf="state.enabled && config.showReadMoreButton !== false"
      class="read-more-button mrg-t-8"
      [ngStyle]="config.readMoreButtonCss"
      [color]="'primary'"
      [text]="'Read More'"
      (clicked)="onReadMoreClicked($event)"
    ></b-text-button>
  `,
})
export class ReadMoreComponent implements OnInit, OnDestroy {
  constructor(
    private host: ElementRef,
    private zone: NgZone,
    private DOM: DOMhelpers,
    private utilsService: UtilsService,
    private mutationObservableService: MutationObservableService
  ) {
    this.hostEl = this.host.nativeElement;
  }

  public hostEl: HTMLElement;
  private contentEl: HTMLElement;
  private updater: Subscription;
  public state: ReadMoreState = {};
  public id = simpleUID('brm-', 7);

  @InputObservable({ ...READ_MORE_CONFIG_DEF })
  @Input('config')
  config$: Observable<ReadMoreConfig>;
  public config: ReadMoreConfig = READ_MORE_CONFIG_DEF;

  @Input() debug = false;

  @Output() clicked: EventEmitter<ReadMoreClickEvent> = new EventEmitter<
    ReadMoreClickEvent
  >();

  @HostListener('click.outside-zone')
  onHostClick() {
    if (
      this.clicked.observers.length &&
      this.config.watchClicks !== 'read-more' &&
      this.config.watchClicks !== false
    ) {
      this.zone.run(() => {
        this.clicked.emit('text');
      });
    }
  }

  ngOnInit(): void {
    this.contentEl = this.hostEl.children[0] as HTMLElement;

    if (this.debug) {
      console.log(
        `---------------------\nReadMore ${this.id}: Init on element`,
        this.hostEl
      );
    }

    this.updater = merge(
      this.config$.pipe(
        tap((config: ReadMoreConfig) => {
          this.config = { ...READ_MORE_CONFIG_DEF, ...config };
          this.DOM.setAttributes(this.hostEl, {
            'data-clickable': this.config.watchClicks + '',
          });

          if (this.debug) {
            console.log(`ReadMore ${this.id}: new config:`, this.config);
          }
        })
      ),

      this.mutationObservableService
        .getMutationObservable(this.hostEl, {
          characterData: true,
          childList: true,
          subtree: true,
          attributes: false,
          mutations: 'processed',
        })
        .pipe(this.config.expectChanges ? tap() : take(3)),

      this.mutationObservableService.getResizeObservervable(this.hostEl, {
        watch: this.config.dynamicFontSize ? 'both' : 'height',
        threshold: 5,
      }),

      this.utilsService.getResizeEvent().pipe(
        outsideZone(this.zone),
        skip(1),
        filter(() => Boolean(this.config.dynamicFontSize))
      )
    )
      .pipe(
        throttleTime(200, undefined, {
          leading: false,
          trailing: true,
        }),
        filter(() => Boolean(this.contentEl?.children.length))
      )
      .subscribe(() => {
        this.checkStuff();
      });
  }

  ngOnDestroy(): void {
    if (this.debug) {
      console.log(`ReadMore ${this.id}: ngOnDestroy`);
    }
    this.updater?.unsubscribe();
  }

  private checkStuff() {
    if (this.state.expanded) {
      if (this.debug) {
        console.log(
          `ReadMore ${this.id}: skipping checkStuff, because expanded is true`
        );
      }

      return;
    }

    if (!this.state.textElement) {
      this.state.textElement = this.contentEl;
      while (this.state.textElement.children.length === 1) {
        this.state.textElement = this.state.textElement
          .children[0] as HTMLElement;
      }
      this.state.textElementCss = {
        marginTop: parseFloat(
          getComputedStyle(this.state.textElement).marginTop
        ),
      };
    }

    if (this.config.dynamicFontSize || !this.state.textProps) {
      this.state.textProps = this.DOM.getElementTextProps(
        this.state.textElement
      );

      this.state.maxHeight = this.config.maxHeight
        ? Math.floor(
            closestDivisable(
              this.config.maxHeight,
              this.state.textProps.lineHeightPx
            ) + this.state.textElementCss.marginTop
          )
        : this.config.maxLines
        ? Math.floor(
            this.state.textProps.lineHeightPx * this.config.maxLines +
              this.state.textElementCss.marginTop
          )
        : null;

      this.DOM.setCssProps(this.contentEl, {
        '--max-height': this.state.maxHeight && this.state.maxHeight + 'px',
        '--line-height':
          this.state.maxHeight && this.state.textProps.lineHeight,
        '--font-size':
          this.state.maxHeight && this.state.textProps.fontSize + 'px',
      });
    }

    if (this.debug) {
      console.log(`ReadMore ${this.id}: checkStuff, state:`, this.state);
    }

    if (
      this.contentEl.scrollHeight <= this.contentEl.offsetHeight ||
      (this.config.linesThreshold &&
        Math.floor(
          Math.abs(
            this.state.maxHeight / this.state.textProps.lineHeightPx -
              this.contentEl.scrollHeight / this.state.textProps.lineHeightPx
          )
        ) <= this.config.linesThreshold)
    ) {
      if (this.debug) {
        console.log(
          `ReadMore ${this.id}: should not need readMore - `,
          'scrollHeight:',
          this.contentEl.scrollHeight,
          ', offsetHeight:',
          this.contentEl.offsetHeight,
          ', will fit lines:',
          Math.floor(
            Math.abs(
              this.state.maxHeight / this.state.textProps.lineHeightPx -
                this.contentEl.scrollHeight / this.state.textProps.lineHeightPx
            )
          )
        );
      }

      this.disableReadMore(false);
      this.ngOnDestroy();
      return;
    }

    this.state.enabled = true;

    this.DOM.setAttributes(this.hostEl, {
      'data-readmore': 'true',
      'data-expanded': 'false',
    });
  }

  public onReadMoreClicked(event: MouseEvent) {
    if (this.debug) {
      console.log(`ReadMore ${this.id}: onReadMoreClicked`);
    }

    if (
      this.clicked.observers.length &&
      this.config.watchClicks !== 'text' &&
      this.config.watchClicks !== false
    ) {
      event.stopPropagation();
      this.clicked.emit('read-more');
    }

    if (!this.config.expandable) {
      return;
    }

    this.disableReadMore(true);
    this.ngOnDestroy();
  }

  private disableReadMore(animate = false) {
    if (this.debug) {
      console.log(`ReadMore ${this.id}: disableReadMore`);
    }

    this.state.expanded = true;
    this.state.enabled = false;

    this.DOM.setCssProps(this.contentEl, {
      transition:
        animate && this.config.animateExpand ? 'max-height 0.3s' : null,
      '--max-height':
        animate && this.config.animateExpand
          ? this.contentEl.scrollHeight + 100 + 'px'
          : 'none',
      '--line-height': null,
      '--font-size': null,
    });

    this.DOM.setAttributes(this.hostEl, {
      'data-readmore': 'false',
      'data-expanded': 'true',
    });
  }
}
