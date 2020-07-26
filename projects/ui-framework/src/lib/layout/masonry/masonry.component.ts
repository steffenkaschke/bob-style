import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  isNumber,
  splitArrayToChunks,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { throttleTime, filter, tap } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputSubject } from '../../services/utils/decorators';
import { BehaviorSubject, merge, Subscription, Subject } from 'rxjs';
import { WindowRef, WindowLike } from '../../services/utils/window-ref.service';

const MASONRY_GAP_DEF = 16;
const MASONRY_COLS_DEF = 3;
const MASONRY_ROW_DIVISION = 1;

const MASONRY_CONFIG_DEF: MasonryConfig = {
  columns: MASONRY_COLS_DEF,
  gap: MASONRY_GAP_DEF,
};

@Component({
  selector: 'b-masonry-layout',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryLayoutComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private windowRef: WindowRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private host: ElementRef,
    private zone: NgZone
  ) {
    this.hostEl = this.host.nativeElement;
    this.nativeWindow = this.windowRef.nativeWindow;
  }

  // tslint:disable-next-line: no-input-rename
  @InputSubject({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: BehaviorSubject<MasonryConfig>;

  private changeDetection$: Subject<void> = new Subject<void>();

  private nativeWindow: WindowLike;
  private hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {} as MasonryState;
  private observer: MutationObserver;
  private updater: Subscription;
  private animationRequestID;

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.processConfig(config);
        })
      ),
      this.changeDetection$,
      this.utilsService.getResizeEvent().pipe(outsideZone(this.zone))
    )
      .pipe(
        throttleTime(50, undefined, {
          leading: false,
          trailing: true,
        }),
        filter(() => {
          return this.stateChanged();
        })
      )
      .subscribe(() => {
        this.zone.runOutsideAngular(() => {
          this.initMasonry(this.hostEl, this.config, this.state);
        });
      });

    this.observer = new MutationObserver(() => {
      this.state = {} as MasonryState;
      this.changeDetection$.next();
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: false,
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.updater?.unsubscribe();
    if (this.animationRequestID) {
      this.nativeWindow.cancelAnimationFrame(this.animationRequestID);
    }
  }

  ngAfterViewInit(): void {
    this.changeDetection$.next();
  }

  private initMasonry(
    element: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
  ): void {
    if (this.animationRequestID) {
      this.nativeWindow.cancelAnimationFrame(this.animationRequestID);
      this.animationRequestID = undefined;
    }

    state.hostWidth = element.offsetWidth;
    state.childrenCount = element.children.length;
    state.config = config;

    this.DOM.setCssProps(element, {
      '--masonry-row-div': MASONRY_ROW_DIVISION + 'px',
      '--masonry-gap': config.gap + 'px',
      '--masonry-col-width': config.columns
        ? `calc(100% / ${config.columns} - ${config.gap}px * ${
            config.columns - 1
          } / ${config.columns})`
        : config.columnWidth && config.columnWidth + 'px',
    });

    const elementChunks: HTMLElement[][] = splitArrayToChunks(
      Array.from(element.children) as HTMLElement[],
      (config.columns || 5) * 3
    );

    let currentChunkIndex = 0;

    const setElementsRowSpan = () => {
      if (!elementChunks[currentChunkIndex]) {
        return;
      }

      elementChunks[currentChunkIndex].forEach((el: HTMLElement) => {
        el.style.removeProperty('grid-row-end');

        let contentHeight = 0;

        if (el.children.length === 1) {
          const elStyle = getComputedStyle(el);
          contentHeight =
            (el.children[0] as HTMLElement).scrollHeight +
            (parseFloat(elStyle.paddingTop) +
              parseFloat(elStyle.paddingBottom) +
              parseFloat(elStyle.borderTopWidth) +
              parseFloat(elStyle.borderBottomWidth));
        }

        let rowSpan =
          (Math.max(el.scrollHeight, el.offsetHeight, contentHeight) +
            this.config.gap) /
          (MASONRY_ROW_DIVISION + this.config.gap);
        rowSpan = contentHeight ? Math.round(rowSpan) : Math.ceil(rowSpan);

        el.style.gridRowEnd = 'span ' + rowSpan;
      });

      ++currentChunkIndex;

      this.animationRequestID = this.nativeWindow.requestAnimationFrame(() => {
        setElementsRowSpan();
      });
    };

    this.animationRequestID = this.nativeWindow.requestAnimationFrame(() => {
      setElementsRowSpan();
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
