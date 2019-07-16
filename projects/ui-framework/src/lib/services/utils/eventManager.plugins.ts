import { Injectable } from '@angular/core';
import { EventManager, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { NativeEvents } from '../../enums';

export enum EventModifiers {
  outsideZone = 'outside-zone'
}
export enum GlobalEventModifiers {
  window = 'window',
  document = 'document',
  body = 'body'
}

@Injectable({
  providedIn: 'root'
})
export class OutsideZonePlugin {
  manager: EventManager;

  private getNativeEventName = eventName => eventName.split('.')[0];

  supports(eventName: string): boolean {
    let testName = eventName.split('.');
    if (
      testName.length !== 2 ||
      !testName[1].includes(EventModifiers.outsideZone)
    ) {
      return false;
    }
    testName = testName[0].split(':');
    if (
      testName.length > 2 ||
      (testName.length === 2 &&
        (!Object.values(GlobalEventModifiers).includes(testName[0]) ||
          !Object.values(NativeEvents).includes(testName[1]))) ||
      (testName.length === 1 &&
        !Object.values(NativeEvents).includes(testName[0]))
    ) {
      return false;
    }
    return true;
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    originalHandler
  ): Function {
    const nativeEventName = this.getNativeEventName(eventName);

    this.manager.getZone().runOutsideAngular(() => {
      this.manager.addEventListener(element, nativeEventName, originalHandler);
    });

    return () => {
      element.removeEventListener(nativeEventName, originalHandler);
    };
  }
}

export const EventManagerPlugins = [
  {
    multi: true,
    provide: EVENT_MANAGER_PLUGINS,
    useClass: OutsideZonePlugin
  }
];
