import { Injectable } from '@angular/core';

@Injectable()
export class FunctionalUtils {
  constructor() {}

  // caches fn calls in (Weak) Map, using first argument as key.
  // good to cache functions that have DOM elements as argument.
  public memoize = (fn: Function) => {
    const memo = new WeakMap();
    return (...args: any[]) => {
      return memo.has(args[0])
        ? memo.get(args[0])
        : memo.set(args[0], fn(...args)).get(args[0]);
    };
  }

  // cache a single fn call, using first argument as key.
  // calls with new argument(s) will overwrite cache.
  public memoizeOne = (fn: Function) => {
    let lastArg: any, lastResult: any;
    return (...args: any[]) => {
      if (lastArg !== args[0]) {
        lastArg = args[0];
        lastResult = fn(...args);
      }
      return lastResult;
    };
  }
}
