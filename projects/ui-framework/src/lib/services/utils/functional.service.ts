import { Injectable } from '@angular/core';

@Injectable()
export class FunctionalUtils {
  constructor() {}

  public memoize = (fn: Function) => {
    const memo = new WeakMap();
    return (...args: any[]) => {
      return memo.has(args[0])
        ? memo.get(args[0])
        : memo.set(args[0], fn(...args)).get(args[0]);
    };
  }

  public memoizeOne = (fn: Function) => {
    let lastArg: any, lastResult: any;
    return (...args: any[]) => {
      if (lastArg !== args[0]) {
        lastArg = args[0];
        lastResult = fn(args[0]);
      }
      return lastResult;
    };
  }
}
