import { Subscription } from 'rxjs';
import { UtilsService } from '../../../ui-framework/src/lib/services/utils/utils.service';
import { outsideZone } from '../../../ui-framework/src/lib/services/utils/rxjs.operators';

import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  NgZone,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { DOMhelpers } from '../../../ui-framework/src/lib/services/utils/dom-helpers.service';
import { ButtonComponent } from '../../../ui-framework/src/lib/buttons-indicators/buttons/button/button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private utilsService: UtilsService,
    private zone: NgZone,
    private DOM: DOMhelpers
  ) {}

  @ViewChild('testDiv', { static: false }) private testDiv: ElementRef;

  editorValue = 'some text';
  scrollSubscription: Subscription;
  resizeSubscription: Subscription;

  classes = '';

  renderButton = {
    component: ButtonComponent,
    attributes: {
      text: 'click me!'
    },
    content: ['button'],
    handlers: {
      clicked: () => {
        console.log('Render component button clicked!');
      }
    }
  };

  addClasses() {
    this.DOM.bindClasses(this.testDiv.nativeElement, [
      'class1',
      'class2',
      'class3'
    ]);
  }

  removeClasses() {
    this.DOM.bindClasses(this.testDiv.nativeElement, {
      class1: false,
      class2: false,
      class3: false
    });
  }

  ngAfterViewInit() {
    this.addClasses();
  }

  updateValue(event) {
    console.log(event);
    this.editorValue = event;
  }

  ngOnInit(): void {
    this.scrollSubscription = this.utilsService
      .getScrollEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(scrollPos => {
        console.log(scrollPos);
      });
    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(scrollPos => {
        console.log('window resized');
      });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }

  getClasses() {
    return this.testDiv ? this.testDiv.nativeElement.className : '';
  }
}
