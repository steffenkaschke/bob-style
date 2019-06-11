import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextareaComponent } from './textarea.component';
import { InputEventType } from '../form-elements.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let textareaElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [NoopAnimationsModule, InputMessageModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TextareaComponent);
        component = fixture.componentInstance;
        spyOn(component.changed, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('emitInputEvent', () => {
    beforeEach(() => {
      textareaElement = fixture.debugElement.query(By.css('textarea'))
        .nativeElement;
    });

    it('should emitInputEvent on input focus with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('focus'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value'
      });
    });
    it('should emitInputEvent on input blur with input value', () => {
      component.value = 'input value';
      textareaElement.dispatchEvent(new Event('blur'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value'
      });
    });
    it('should emitInputEvent on model change with input value', () => {
      textareaElement.value = 'change input value';
      textareaElement.dispatchEvent(new Event('input'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value'
      });
    });
  });
});
