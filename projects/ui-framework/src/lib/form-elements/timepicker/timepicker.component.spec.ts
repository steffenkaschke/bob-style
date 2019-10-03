import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './timepicker.component';
import { InputEventType } from '../form-elements.enum';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { InputTypes } from './timepicker.enum';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [NoopAnimationsModule, CommonModule, InputMessageModule],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        spyOn(component.changed, 'emit');
        spyOn(component, 'propagateChange');
      });
  }));


});
