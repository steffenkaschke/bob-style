import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  OnDestroy,
  DoCheck,
  AfterViewInit,
} from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { isNumber } from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { throttleTime, filter, tap } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputSubject } from '../../services/utils/decorators';
import { BehaviorSubject, merge, Subscription, Subject } from 'rxjs';

const MASONRY_GAP_DEF = 16;
const MASONRY_COLS_DEF = 3;
const MASONRY_ROW_DEVISION = 4;

const MASONRY_CONFIG_DEF: MasonryConfig = {
  columns: MASONRY_COLS_DEF,
  gap: MASONRY_GAP_DEF,
};

@Component({
  selector: 'b-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryComponent
  implements DoCheck, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private host: ElementRef,
    private zone: NgZone
  ) {
    this.hostEl = this.host.nativeElement;
  }

  // tslint:disable-next-line: no-input-rename
  @InputSubject({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: BehaviorSubject<MasonryConfig>;

  private changeDetection$: Subject<void> = new Subject<void>();

  private hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {} as MasonryState;
  private updater: Subscription;

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.processConfig(config);
        })
      ),
      this.changeDetection$,
      this.utilsService.getResizeEvent()
    )
      .pipe(
        outsideZone(this.zone),
        throttleTime(50, undefined, {
          leading: false,
          trailing: true,
        }),
        filter(() => {
          return this.host?.nativeElement && this.config && this.stateChanged();
        })
      )
      .subscribe(() => {
        this.initMasonry(this.hostEl, this.config, this.state);
      });
  }

  ngOnDestroy(): void {
    this.updater?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.changeDetection$.next();
  }

  ngDoCheck() {
    if (this.stateChanged()) {
      this.changeDetection$.next();
    }
  }

  private initMasonry(
    element: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
  ): void {
    state.hostWidth = element.offsetWidth;
    state.childrenCount = element.children.length;
    state.config = config;

    this.DOM.setCssProps(element, {
      '--masonry-row-div': MASONRY_ROW_DEVISION + 'px',
      '--masonry-gap': config.gap + 'px',
      '--masonry-col-width': config.columns
        ? `calc(100% / ${config.columns} - ${config.gap}px * ${
            config.columns - 1
          } / ${config.columns})`
        : config.columnWidth && config.columnWidth + 'px',
    });

    Array.from(element.children).forEach((el: HTMLElement) => {
      el.style.removeProperty('grid-row-end');
      const rowSpan = Math.ceil(
        (Math.max(el.scrollHeight, el.offsetHeight) + this.config.gap) /
          (MASONRY_ROW_DEVISION + this.config.gap)
      );
      el.style.gridRowEnd = 'span ' + rowSpan;
    });
  }

  private processConfig(config: MasonryConfig): MasonryConfig {
    if (!config) {
      return { ...MASONRY_CONFIG_DEF };
    }

    config.gap = isNumber(config.gap) ? config.gap : MASONRY_GAP_DEF;
    config.columns = isNumber(config.columns)
      ? config.columns || null
      : MASONRY_COLS_DEF;
    config.columnWidth = isNumber(config.columnWidth)
      ? config.columnWidth || null
      : null;

    return config;
  }

  private stateChanged(): boolean {
    return Boolean(
      !this.state ||
        this.state.config !== this.config ||
        this.state.childrenCount !== this.hostEl.children.length ||
        Math.abs(this.state.hostWidth - this.hostEl.offsetWidth) > 20
    );
  }
}
