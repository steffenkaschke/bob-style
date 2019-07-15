import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class OutsideZonePlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    return eventName.endsWith('outside-zone');
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    originalHandler
  ): Function {
    let nativeEventName = eventName.split('.') as any;
    nativeEventName.pop();
    nativeEventName = nativeEventName.join('.');

    this.manager.getZone().runOutsideAngular(() => {
      element.addEventListener(nativeEventName, originalHandler);
    });

    return () => {
      element.removeEventListener(nativeEventName, originalHandler);
    };
  }
}
