import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, share, shareReplay } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';

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
      shareReplay(1)
    );

    this.winScroll$ = fromEvent(this.windowRef.nativeWindow, 'scroll').pipe(
      map((e: Event) => ({
        scrollY: (e.currentTarget as Window).scrollY,
        scrollX: (e.currentTarget as Window).scrollX
      })),
      shareReplay(1)
    );
    this.winClick$ = fromEvent(this.windowRef.nativeWindow, 'click').pipe(
      share()
    ) as Observable<MouseEvent>;
    this.winKey$ = fromEvent(this.windowRef.nativeWindow, 'keydown').pipe(
      share()
    ) as Observable<KeyboardEvent>;
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
}
