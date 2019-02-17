import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class UtilsService {
  constructor() {}

  public getResizeEvent(): Observable<any> {
    return fromEvent(window, 'resize').pipe(debounceTime(500));
  }
}
