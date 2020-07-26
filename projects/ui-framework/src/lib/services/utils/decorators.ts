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
