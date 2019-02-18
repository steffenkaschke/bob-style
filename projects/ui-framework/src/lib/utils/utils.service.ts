import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
// import { WindowRef } from './window-ref.service';
// public windowRef: WindowRef
@Injectable()
export class UtilsService {
  constructor() {}

  public getResizeEvent(): Observable<any> {
    return of(true);
    // return fromEvent(this.windowRef.nativeWindow, 'resize').pipe(debounceTime(500));
  }
}
