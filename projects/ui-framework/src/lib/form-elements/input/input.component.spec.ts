import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { InputEventType } from './input.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        spyOn(component.inputEvents, 'emit');
        fixture.detectChanges();
      });
  }));


  describe('emitInputEvent', () => {
    beforeEach(() => {
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should emitInputEvent on input focus with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('focus'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value',
      });
    });
    it('should emitInputEvent on input blur with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('blur'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value',
      });
    });
    it('should emitInputEvent on model change with input value', () => {
      inputElement.value = 'change input value';
      inputElement.dispatchEvent(new Event('input'));
      expect(component.inputEvents.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value',
      });
    });
  });

  describe('addAttributesToBaseInput', () => {
    it('Should add attributes to base input', () => {
      const inputTemplate = InputComponent.addAttributesToBaseInput('[myCustomAttribute1]="1" [myCustomAttribute2]="2"');
      expect(inputTemplate).toContain('[myCustomAttribute1]="1" [myCustomAttribute2]="2">');
    });
  });
});
