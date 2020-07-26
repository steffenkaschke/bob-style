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
import { splitArrayToChunks } from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { throttleTime, filter, tap } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputObservable } from '../../services/utils/decorators';
import { merge, Subscription, Subject, of, Observable } from 'rxjs';
import {
  WindowRef,
  WindowLike,
  ResizeObserverInstance,
} from '../../services/utils/window-ref.service';
import { MasonryService } from './masonry.service';
import { MASONRY_CONFIG_DEF, MASONRY_ROW_DIVISION } from './masonry.const';

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
    private zone: NgZone,
    private service: MasonryService
  ) {
    this.hostEl = this.host.nativeElement;
    this.nativeWindow = this.windowRef.nativeWindow;
  }

  // tslint:disable-next-line: no-input-rename
  @InputObservable({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: Observable<MasonryConfig>;

  private changeDetection$: Subject<any> = new Subject<any>();

  private nativeWindow: WindowLike;
  private hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {} as MasonryState;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserverInstance;
  private updater: Subscription;
  private animationRequestID;

  private elementsToUpdate: Set<HTMLElement> = new Set();
  firstRun = true;

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.service.processConfig(config);
        })
      ),
      this.utilsService.getResizeEvent().pipe(outsideZone(this.zone)),
      this.changeDetection$
    )
      .pipe(
        throttleTime(100, undefined, {
          leading: true,
          trailing: true,
        }),
        filter(() => {
          return (
            this.elementsToUpdate.size > 0 ||
            this.service.stateChanged(this.hostEl, this.config, this.state)
          );
        })
      )
      .subscribe((smth) => {
        // this.zone.runOutsideAngular(() => {
        if (
          !this.firstRun &&
          smth &&
          this.elementsToUpdate.size > 0 &&
          this.hostEl.children[0]
            ?.getAttribute('style')
            ?.includes('grid-row-end')
        ) {
          console.log('will update');
          const elements = Array.from(this.elementsToUpdate);
          this.elementsToUpdate.clear();

          this.updateElementsRowSpan(elements, this.config);

          console.log(elements.length, this.elementsToUpdate.size);
        } else {
          console.log('will init');
          this.initMasonry(this.hostEl, this.config, this.state);

          this.firstRun = false;
        }
        // });
      });

    // this.zone.runOutsideAngular(() => {
    if (this.nativeWindow.MutationObserver) {
      this.mutationObserver = new MutationObserver((mutations) => {
        const backup = new Set(this.elementsToUpdate);
        this.elementsToUpdate = new Set([
          ...backup,
          ...mutations.reduce(
            (elems: HTMLElement[], mutation: MutationRecord) => {
              const target = this.DOM.getClosestUntil(
                mutation.target as HTMLElement,
                'b-masonry-layout > *',
                this.hostEl
              );

              if (!target || target === this.hostEl) {
                return elems;
              }

              elems.push(target);
              return elems;
            },
            []
          ),
        ]);

        this.changeDetection$.next(true);
      });

      this.mutationObserver.observe(this.hostEl, {
        childList: true,
        subtree: true,
        characterData: true,
        attributeFilter: ['src', 'data-loaded'],
      });
    }
    // });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
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
      // this.nativeWindow.cancelAnimationFrame(this.animationRequestID);
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

    this.updateElementsRowSpan(
      Array.from(element.children) as HTMLElement[],
      config
    );
  }

  private updateElementsRowSpan(
    elements: HTMLElement[],
    config: MasonryConfig
  ): void {
    const elementChunks: HTMLElement[][] = splitArrayToChunks(
      elements,
      (config.columns || 5) * 3
    );

    let currentChunkIndex = 0;

    const setElementsRowSpan = () => {
      if (!elementChunks[currentChunkIndex]) {
        return;
      }

      elementChunks[currentChunkIndex].forEach((el: HTMLElement) => {
        this.service.setElementRowSpan(el, this.config);
      });

      ++currentChunkIndex;

      // this.animationRequestID =
      this.nativeWindow.requestAnimationFrame(() => {
        setElementsRowSpan();
      });
    };

    // this.animationRequestID =
    this.nativeWindow.requestAnimationFrame(() => {
      setElementsRowSpan();
    });
  }
}
