import { Injectable } from '@angular/core';
import { fromEvent, Observable, merge } from 'rxjs';
import {
  debounceTime,
  map,
  share,
  shareReplay,
  throttleTime,
  tap,
  startWith,
  filter,
  distinctUntilChanged
} from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';
import { DOMhelpers } from '../html/dom-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  winResize$: Observable<any>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<MouseEvent>;
  winKey$: Observable<KeyboardEvent>;

  constructor(private windowRef: WindowRef) {
    this.winResize$ = fromEvent(this.windowRef.nativeWindow, 'resize').pipe(
      debounceTime(500),
      share()
    );

    this.winScroll$ = fromEvent(this.windowRef.nativeWindow, 'scroll').pipe(
      map((e: Event) => ({
        scrollY: ((e.currentTarget as any) || (document.scrollingElement as any)).scrollY,
        scrollX: ((e.currentTarget as any) || (document.scrollingElement as any)).scrollX
      })),
      share()
    );
    this.winClick$ = fromEvent(this.windowRef.nativeWindow, 'click').pipe(share()) as Observable<MouseEvent>;
    this.winKey$ = fromEvent(this.windowRef.nativeWindow, 'keydown').pipe(share()) as Observable<KeyboardEvent>;
  }

  public getResizeEvent(): Observable<any> {
    return this.winResize$;
  }

  public getScrollEvent(): Observable<ScrollEvent> {
    return this.winScroll$;
  }

  public getWindowClickEvent(): Observable<MouseEvent> {
    return this.winClick$;
  }

  public getWindowKeydownEvent(): Observable<KeyboardEvent> {
    return this.winKey$;
  }

  public getElementInViewEvent(element: HTMLElement): Observable<boolean> {
    return merge(this.winScroll$, this.winResize$).pipe(
      startWith(1),
      throttleTime(300, undefined, {
        leading: true,
        trailing: true
      }),
      map(() => DOMhelpers.prototype.isInView(element)),
      distinctUntilChanged()
    );
  }
}
