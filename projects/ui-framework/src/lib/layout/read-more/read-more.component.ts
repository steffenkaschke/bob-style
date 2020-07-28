import {
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
  Component,
  NgZone,
} from '@angular/core';
import { ReadMoreType } from './read-more.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  ResizeObserverInstance,
  WindowRef,
  WindowLike,
} from '../../services/utils/window-ref.service';
import { closestDivisable } from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { InputObservable } from '../../services/utils/decorators';
import { Subscription, merge, Observable, Subject } from 'rxjs';
import { tap, skip, throttleTime, filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';

@Component({
  selector: 'b-read-more',
  styleUrls: ['./read-more.component.scss'],
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
    <b-text-button
      *ngIf="needsReadMoreButton"
      class="read-more-button mrg-t-8"
      [color]="'primary'"
      [text]="'Read More'"
      (clicked)="onReadMoreClicked()"
    ></b-text-button>
  `,
})
export class ReadMoreComponent implements OnInit, OnDestroy {
  constructor(
    private windowRef: WindowRef,
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone
  ) {
    this.nativeWindow = this.windowRef.nativeWindow;
    this.hostEl = this.host.nativeElement;
  }

  private nativeWindow: WindowLike;
  private hostEl: HTMLElement;
  private contentEl: HTMLElement;
  private updater: Subscription;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserverInstance;

  public needsReadMoreButton = false;

  @Input() bReadMore = 10;

  // tslint:disable-next-line: no-input-rename
  @InputObservable(null)
  @Input('maxHeight')
  maxHeight$: Observable<number>;

  private maxHeight: number;

  private changeDetection$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.updater = merge(
      this.maxHeight$.pipe(
        tap((maxHeight: number) => {
          this.maxHeight = maxHeight;
        })
      ),
      this.utilsService.getResizeEvent().pipe(outsideZone(this.zone), skip(1)),
      this.changeDetection$
    )
      .pipe(
        throttleTime(100, undefined, {
          leading: false,
          trailing: true,
        }),
        filter(() => Boolean(this.hostEl?.children.length)),
        tap(() => {
          if (!this.contentEl) {
            this.contentEl = this.hostEl?.children[0] as HTMLElement;
          }
        })
      )
      .subscribe(() => {
        this.checkStuff();
      });

    this.mutationObserver = new MutationObserver(() => {
      this.changeDetection$.next();
    });

    this.resizeObserver = new this.nativeWindow.ResizeObserver(() => {
      this.changeDetection$.next();
    });

    this.mutationObserver.observe(this.hostEl, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: false,
    });
    this.resizeObserver.observe(this.hostEl);
  }

  checkStuff() {
    this.needsReadMoreButton =
      this.contentEl.scrollHeight > this.hostEl.offsetHeight;

    let deepEl = this.contentEl;

    while (deepEl.children.length === 1) {
      deepEl = deepEl.children[0] as HTMLElement;
    }

    const textProps = this.DOM.getElementTextProps(deepEl);

    this.DOM.setCssProps(this.contentEl, {
      '--max-height': this.maxHeight
        ? closestDivisable(
            this.maxHeight,
            textProps.fontSize * textProps.lineHeight
          ) + 'px'
        : null,
      '--line-height': textProps.lineHeight,
      '--font-size': textProps.fontSize + 'px',

      'mask-image': null,
      '-webkit-mask-image': null,
    });
  }

  onReadMoreClicked() {
    this.ngOnDestroy();

    this.DOM.setCssProps(this.contentEl, {
      transition: 'max-height 0.3s',
      '--max-height': this.contentEl.scrollHeight + 100 + 'px',
      'mask-image': 'none',
      '-webkit-mask-image': 'none',
    });

    this.needsReadMoreButton = false;
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.updater?.unsubscribe();
  }
}
