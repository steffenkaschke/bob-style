import { Type } from '@angular/core';

export type DynamicComponentContent =
  | string
  | DynamicComponent
  | (string | DynamicComponent)[];

export interface DynamicComponentHandlers {
  [key: string]: (...args: any[]) => void;
}

export interface DynamicComponent {
  component: Type<any>;
  attributes?: object;
  content?: DynamicComponentContent;
  handlers?: DynamicComponentHandlers;
}
