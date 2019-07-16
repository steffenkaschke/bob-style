import {
  NgModule,
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostBinding,
  HostListener
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// tslint:disable-next-line: max-line-length
import { ComponentRendererModule } from '../../../../ui-framework/src/lib/services/component-renderer/component-renderer.module';
import { ButtonsModule } from '../../../../ui-framework/src/lib/buttons-indicators/buttons/buttons.module';
import { EventManagerPlugins } from '../../../../ui-framework/src/lib/services/utils/eventManager.plugins';
import { UtilComponentsModule } from '../../../../ui-framework/src/lib/services/util-components/utilComponents.module';
import { stringify } from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { FormsModule } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mock-button',
  template: `
    <button
      *ngIf="outside && !ignoreMove"
      type="button"
      (click.outside-zone)="onClick($event)"
      (keydown.outside-zone)="onKeyDown($event)"
      (focus.outside-zone)="onFocus($event)"
      (blur.outside-zone)="onBlur($event)"
      (mouseenter.outside-zone)="onMouseEnter($event)"
      (mouseleave.outside-zone)="onMouseLeave($event)"
      (mousemove.outside-zone)="onMouseMove($event)"
    >
      click
    </button>
    <button
      *ngIf="!outside && !ignoreMove"
      type="button"
      (click)="onClick($event)"
      (keydown)="onKeyDown($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (mouseenter)="onMouseEnter($event)"
      (mouseleave)="onMouseLeave($event)"
      (mousemove)="onMouseMove($event)"
    >
      click
    </button>

    <button
      *ngIf="outside && ignoreMove"
      type="button"
      (click.outside-zone)="onClick($event)"
      (keydown.outside-zone)="onKeyDown($event)"
      (focus.outside-zone)="onFocus($event)"
      (blur.outside-zone)="onBlur($event)"
      (mouseenter.outside-zone)="onMouseEnter($event)"
      (mouseleave.outside-zone)="onMouseLeave($event)"
    >
      click
    </button>
    <button
      *ngIf="!outside && ignoreMove"
      type="button"
      (click)="onClick($event)"
      (keydown)="onKeyDown($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (mouseenter)="onMouseEnter($event)"
      (mouseleave)="onMouseLeave($event)"
    >
      click
    </button>

    <label
      ><input type="checkbox" [(ngModel)]="outside" /> bind events outside
      zone</label
    >
    <label
      ><input type="checkbox" [(ngModel)]="ignoreMove" /> ignore
      mousemove</label
    >
  `,
  styles: [
    'button {display: block; width: 100px; height: 50px; text-transform: uppercase; margin: 0 auto 15px;}',

    'label {display:block;}'
  ]
})
export class MockButtonComponent {
  outside = true;
  ignoreMove = true;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() keyed: EventEmitter<void> = new EventEmitter<void>();
  @Output() focused: EventEmitter<void> = new EventEmitter<void>();
  @Output() blurred: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }
  onKeyDown($event) {
    this.keyed.emit($event);
  }
  onFocus($event) {
    this.focused.emit($event);
  }
  onBlur($event) {
    this.blurred.emit($event);
  }
  onMouseEnter($event) {
    this.mouseIn.emit($event);
  }
  onMouseLeave($event) {
    this.mouseOut.emit($event);
  }
  onMouseMove($event) {
    this.mouseMove.emit($event);
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'click-forwarder-1',
  template: `
    <mock-button
      (clicked)="onClick($event)"
      (keyed)="onKeyDown($event)"
      (focused)="onFocus($event)"
      (blurred)="onBlur($event)"
      (mouseIn)="onMouseEnter($event)"
      (mouseOut)="onMouseLeave($event)"
      (mouseMove)="onMouseMove($event)"
      >click</mock-button
    >
  `,
  styles: [':host {display: block; margin: 20px auto;}']
})
// tslint:disable-next-line: component-class-suffix
export class ClickForwarerComponent1 {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() keyed: EventEmitter<void> = new EventEmitter<void>();
  @Output() focused: EventEmitter<void> = new EventEmitter<void>();
  @Output() blurred: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }
  onKeyDown($event) {
    this.keyed.emit($event);
  }
  onFocus($event) {
    this.focused.emit($event);
  }
  onBlur($event) {
    this.blurred.emit($event);
  }
  onMouseEnter($event) {
    this.mouseIn.emit($event);
  }
  onMouseLeave($event) {
    this.mouseOut.emit($event);
  }
  onMouseMove($event) {
    this.mouseMove.emit($event);
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'click-forwarder-2',
  template: `
    <b-component-renderer [render]="renderButton"></b-component-renderer>
    <!-- <click-forwarder-1
      (clicked)="onClick($event)"
      (keyed)="onKeyDown($event)"
      (focused)="onFocus($event)"
      (blurred)="onBlur($event)"
      (mouseIn)="onMouseEnter($event)"
      (mouseOut)="onMouseLeave($event)"
      (mouseMove)="onMouseMove($event)"
    ></click-forwarder-1> -->
  `,
  styles: [':host {display: block; margin: 20px auto;}']
})
// tslint:disable-next-line: component-class-suffix
export class ClickForwarerComponent2 {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() keyed: EventEmitter<void> = new EventEmitter<void>();
  @Output() focused: EventEmitter<void> = new EventEmitter<void>();
  @Output() blurred: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter<void>();

  renderButton = {
    component: ClickForwarerComponent1,

    handlers: {
      clicked: $event => {
        this.onClick($event);
      },
      keyed: $event => {
        this.onKeyDown($event);
      },
      focused: $event => {
        this.onFocus($event);
      },
      blurred: $event => {
        this.onBlur($event);
      },
      mouseIn: $event => {
        this.onMouseEnter($event);
      },
      mouseOut: $event => {
        this.onMouseLeave($event);
      },
      mouseMove: $event => {
        this.onMouseMove($event);
      }
    }
  };

  onClick($event) {
    this.clicked.emit($event);
  }
  onKeyDown($event) {
    this.keyed.emit($event);
  }
  onFocus($event) {
    this.focused.emit($event);
  }
  onBlur($event) {
    this.blurred.emit($event);
  }
  onMouseEnter($event) {
    this.mouseIn.emit($event);
  }
  onMouseLeave($event) {
    this.mouseOut.emit($event);
  }
  onMouseMove($event) {
    this.mouseMove.emit($event);
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'event-manager-tester',
  template: `
    <div
      style="width:400px; display: flex; flex-direction: column;
       align-items: center; margin: 40px auto 0; text-align: center;"
    >
      <click-forwarder-2
        (clicked)="onClick($event)"
        (keyed)="onKeyDown($event)"
        (focused)="onFocus($event)"
        (blurred)="onBlur($event)"
        (mouseIn)="onMouseEnter($event)"
        (mouseOut)="onMouseLeave($event)"
        (mouseMove)="onMouseMove($event)"
      >
      </click-forwarder-2>
      <div
        #logger
        style="text-align:left; width: 200px; border: 1px solid black; padding: 15px;"
      ></div>
    </div>
  `,
  styles: [':host {display: block; margin: 20px auto;}']
})
export class EventManagerTesterComponent {
  @ViewChild('logger', { static: false }) private loggerDiv: ElementRef;

  counter = {
    click: 0,
    keydown: 0,
    focus: 0,
    blur: 0,
    mouseenter: 0,
    mouseleave: 0,
    mousemove: 0
  };

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event) {
    this.log($event.type, 'host');
  }
  // @HostListener('window:keydown.outside-zone', ['$event'])
  // onHostKeydown($event) {
  //   this.log($event.type, 'host window', $event.key);
  // }

  onClick($event) {
    this.log($event.type);
  }
  onKeyDown($event) {
    this.log($event.type, $event.key);
  }
  onFocus($event) {
    this.log($event.type);
  }
  onBlur($event) {
    this.log($event.type);
  }
  onMouseEnter($event) {
    this.log($event.type);
  }
  onMouseLeave($event) {
    this.log($event.type);
  }
  onMouseMove($event) {
    this.log($event.type);
  }
  log(...event) {
    ++this.counter[event[0]];
    console.log(event.join(' '), this.counter[event[0]]);
    this.loggerDiv.nativeElement.innerHTML = stringify(this.counter)
      .replace(/"|{|}/g, '')
      .replace(/:/g, ': ')
      .replace(/,/g, '<br>');
  }
}

@NgModule({
  declarations: [
    MockButtonComponent,
    ClickForwarerComponent1,
    ClickForwarerComponent2,
    EventManagerTesterComponent
  ],
  exports: [
    MockButtonComponent,
    ClickForwarerComponent1,
    ClickForwarerComponent2,
    EventManagerTesterComponent
  ],
  imports: [
    BrowserModule,
    ComponentRendererModule,
    ButtonsModule,
    UtilComponentsModule,
    FormsModule
  ],
  providers: [...EventManagerPlugins],
  entryComponents: [MockButtonComponent, ClickForwarerComponent1]
})
export class EventManagerModule {}
