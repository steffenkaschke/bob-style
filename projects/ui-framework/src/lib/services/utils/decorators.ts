import { BehaviorSubject } from 'rxjs';

/*
  Inspiration:
  https://github.com/Futhark/ngx-observable-input
  https://github.com/insidewhy/observable-input

  Example:
  @InputSubject('Untitled') @Input('title') public title$: BehaviorSubject<string>;
*/
export function InputSubject(defaultValue: any) {
  const subjectSymbol = Symbol();

  return (target, key) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject(value);
        }
        if (value !== this[subjectSymbol].getValue()) {
          this[subjectSymbol].next(value);
        }
      },
      get: function () {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject(defaultValue);
        }
        return this[subjectSymbol];
      },
    });
  };
}

/*
  Inspiration:
  https://github.com/Futhark/ngx-observable-input
  https://github.com/insidewhy/observable-input

  Example:
  @InputObservable('Untitled') @Input('title') public title$: Observable<string>;
*/
export function InputObservable(defaultValue: any) {
  const subjectSymbol = Symbol();
  const subjectSymbolObservable = Symbol();

  return (target, key) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject(value);
          this[subjectSymbolObservable] = this[subjectSymbol].asObservable();
        }
        if (value !== this[subjectSymbol].getValue()) {
          this[subjectSymbol].next(value);
        }
      },
      get: function () {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject(defaultValue);
          this[subjectSymbolObservable] = this[subjectSymbol].asObservable();
        }
        return this[subjectSymbolObservable];
      },
    });
  };
}
