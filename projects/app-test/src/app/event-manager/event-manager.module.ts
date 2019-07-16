import {
  NgModule,
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// tslint:disable-next-line: max-line-length
import { ComponentRendererModule } from '../../../../ui-framework/src/lib/services/component-renderer/component-renderer.module';
import { ButtonsModule } from '../../../../ui-framework/src/lib/buttons-indicators/buttons/buttons.module';
import { EventManagerPlugins } from '../../../../ui-framework/src/lib/services/utils/eventManager.plugins';
import { UtilComponentsModule } from '../../../../ui-framework/src/lib/services/util-components/utilComponents.module';
import {
  stringify,
  simpleUID
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { FormsModule } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mock-button',
  template: `
    <button
      *ngIf="outside && !ignoreMove"
      type="button"
      (click.outside-zone,keydown.outside-zone,focus.outside-zone,blur.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone,mousemove.outside-zone)="
        emit($event)
      "
    >
      click
    </button>

    <button
      *ngIf="!outside && !ignoreMove"
      type="button"
      (click,keydown,focus,blur,mouseenter,mouseleave,mousemove)="emit($event)"
    >
      click
    </button>

    <button
      *ngIf="outside && ignoreMove"
      class="outside-ignoreMove"
      type="button"
      (click.outside-zone,keydown.outside-zone,focus.outside-zone,blur.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone)="
        emit($event)
      "
    >
      click
    </button>

    <button
      *ngIf="!outside && ignoreMove"
      class="not-outside-ignoreMove"
      type="button"
      (click,keydown,focus,blur,mouseenter,mouseleave)="emit($event)"
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
    <span>{{ randID }}</span>
  `,
  styles: [
    'button {display: block; width: 100px; height: 50px; text-transform: uppercase; margin: 0 auto 15px;}',
    'label, span {display:block;}'
  ]
})
export class MockButtonComponent {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}
  outside = true;
  ignoreMove = true;
  randID = simpleUID();

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() keyed: EventEmitter<void> = new EventEmitter<void>();
  @Output() focused: EventEmitter<void> = new EventEmitter<void>();
  @Output() blurred: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseOut: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseMove: EventEmitter<void> = new EventEmitter<void>();

  emit($event) {
    switch ($event.type) {
      case 'click':
        this.clicked.emit($event);
        break;
      case 'keydown':
        this.keyed.emit($event);
        break;
      case 'focus':
        this.focused.emit($event);
        break;
      case 'blur':
        this.blurred.emit($event);
        break;
      case 'mouseenter':
        this.mouseIn.emit($event);
        break;
      case 'mouseleave':
        this.mouseOut.emit($event);
        break;
      case 'mousemove':
        this.mouseMove.emit($event);
        break;
      default:
        return false;
    }
    this.randID = simpleUID();
    // this.cd.detectChanges();
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
        *ngIf="show"
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
      <span>{{ randID }}</span>
      <label><input type="checkbox" [(ngModel)]="show" /> show component</label>
    </div>
  `,
  styles: [':host {display: block; margin: 20px auto;}']
})
export class EventManagerTesterComponent {
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}

  @ViewChild('logger', { static: false }) private loggerDiv: ElementRef;

  show = true;
  randID = simpleUID();

  counter = {
    click: 0,
    keydown: 0,
    focus: 0,
    blur: 0,
    mouseenter: 0,
    mouseleave: 0,
    mousemove: 0
  };

  // @HostListener(
  //   'click.outside-zone,mouseenter.outside-zone,mouseleave.outside-zone',
  //   ['$event']
  // )
  // onHostEvent($event) {
  //   this.log($event.type, 'host');
  // }
  // @HostListener('window:keydown.outside-zone,window:click.outside-zone', [
  //   '$event'
  // ])
  onWindowEvent($event) {
    this.log($event.type, 'window', $event.key || $event.clientX);
  }

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
    // this.zone.runGuarded(() => {
    this.randID = simpleUID();
    // this.cd.detectChanges();
    // });
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
