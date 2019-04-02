
import { Type } from '@angular/core';

export type DynamicComponentContent =
  | string
  | DynamicComponentObj
  | (string | DynamicComponentObj)[];

export interface DynamicComponentHandlersObj {
  [key: string]: (...args: any[]) => void;
}

export interface DynamicComponentObj {
  component: Type<any>;
  attributes?: object;
  content?: DynamicComponentContent;
  handlers?: DynamicComponentHandlersObj;
}
