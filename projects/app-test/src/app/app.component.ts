import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { DOMhelpers } from '../../../ui-framework/src/lib/services/utils/dom-helpers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private DOM: DOMhelpers) {}

  @ViewChild('testDiv', { static: false }) private testDiv: ElementRef;

  editorValue = 'some text';

  classes = '';

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

  ngOnInit() {}

  ngAfterViewInit() {
    this.addClasses();
  }

  updateValue(event) {
    console.log(event);
    this.editorValue = event;
  }

  getClasses() {
    return this.testDiv ? this.testDiv.nativeElement.className : '';
  }
}
