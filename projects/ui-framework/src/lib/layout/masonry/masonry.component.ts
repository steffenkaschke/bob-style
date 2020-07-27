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
import { UtilsService } from '../../services/utils/utils.service';
import { throttleTime, filter, tap, skip } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputObservable } from '../../services/utils/decorators';
import { merge, Subscription, Subject, Observable } from 'rxjs';
import { WindowRef, WindowLike } from '../../services/utils/window-ref.service';
import { MasonryService } from './masonry.service';
import { MASONRY_CONFIG_DEF, MASONRY_OBSERVER_CONFIG } from './masonry.const';

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

  @Input() debug = false;

  // tslint:disable-next-line: no-input-rename
  @InputObservable({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: Observable<MasonryConfig>;

  private changeDetection$: Subject<any> = new Subject<any>();

  private nativeWindow: WindowLike;
  private hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {};
  private observer: MutationObserver;
  private updater: Subscription;

  private elementsToUpdate: Set<HTMLElement> = new Set();

  private disabled = false;

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.service.processConfig(config);

          if (this.debug) {
            console.log('Masonry: new config:', this.config);
          }
        })
      ),
      this.utilsService.getResizeEvent().pipe(
        outsideZone(this.zone),
        skip(1),
        filter(
          () =>
            this.hostEl &&
            this.state.hostWidth &&
            Math.abs(this.state.hostWidth - this.hostEl.offsetWidth) > 20
        ),
        tap(() => {
          if (this.debug) {
            console.log(
              `Masonry: window resized, prev hostWidth: ${this.state.hostWidth}, new hostWidth: ${this.hostEl.offsetWidth}`
            );
          }

          this.state.hostWidth = this.hostEl.offsetWidth;
        })
      ),
      this.changeDetection$
    )
      .pipe(
        throttleTime(100, undefined, {
          leading: false,
          trailing: true,
        })
      )
      .subscribe(() => {
        if (!this.hostEl?.children.length) {
          return;
        }

        if (
          this.config.columnWidth &&
          this.state.hostWidth &&
          this.disabled ===
            this.config.columnWidth * 2 + this.config.gap > this.state.hostWidth
        ) {
          if (this.debug) {
            console.log(
              `Masonry: hostWidth (${this.state.hostWidth}) too narrow for more than 1 column (of min-width ${this.config.columnWidth}), converting to single column`
            );
          }

          this.observer?.disconnect();
          this.service.cleanupMasonry(this.hostEl);

          this.hostEl.classList.add('single-column');

          return;
        }

        this.zone.runOutsideAngular(() => {
          if (!this.state.config || this.elementsToUpdate.size === 0) {
            this.elementsToUpdate.clear();
            this.init(this.config);
            return;
          }

          if (this.debug) {
            console.log(
              'Masonry update: ' + this.elementsToUpdate.size + ' items.'
            );
          }

          const elements = Array.from(this.elementsToUpdate);
          this.elementsToUpdate.clear();

          this.service.updateElementsRowSpan(elements, this.config);
        });
      });

    this.zone.runOutsideAngular(() => {
      if (this.nativeWindow.MutationObserver) {
        //
        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation: MutationRecord) => {
            const target = this.DOM.getClosestUntil(
              mutation.target,
              'b-masonry-layout > *',
              this.hostEl
            );

            if (target && target !== this.hostEl) {
              this.elementsToUpdate.add(target);
            }
          });
          this.changeDetection$.next();
        });

        this.observer.observe(this.hostEl, MASONRY_OBSERVER_CONFIG);
      }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetection$.next();
  }

  ngOnDestroy(): void {
    this.destroy(false);
  }

  public init(config: MasonryConfig = this.config): void {
    if (this.debug) {
      console.log('Masonry: init');
    }
    if (!this.updater && !this.observer) {
      this.ngOnInit();
    }
    this.service.initMasonry(this.hostEl, config, this.state);
  }

  public destroy(fullCleanup = true): void {
    if (this.debug) {
      console.log('Masonry: destroy');
    }
    this.observer?.disconnect();
    this.updater?.unsubscribe();

    if (fullCleanup) {
      this.state = {};
      this.updater = this.observer = undefined;
      this.service.cleanupMasonry(this.hostEl);
    }
  }
}
