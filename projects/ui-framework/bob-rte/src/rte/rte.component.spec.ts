import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
  flush
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import {
  NO_ERRORS_SCHEMA,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  FormGroup
} from '@angular/forms';

import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { RichTextEditorComponent } from './rte.component';

import {
  InputMessageComponent,
  FormElementLabelModule,
  InputMessageModule,
  SingleSelectPanelModule,
  ButtonsModule,
  HtmlParserHelpers,
  RTEType,
  simpleChange,
  BlotType
} from 'bob-style';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';
import { PlaceholdersConverterService } from './placeholders.service';
import { placeholderMock, mentionsOptions } from './rte.mocks';

describe('RichTextEditorComponent', () => {
  let fixture: ComponentFixture<RichTextEditorComponent>;
  let RTEComponent: RichTextEditorComponent;
  let RTEnativeElement: HTMLElement;
  let RTEeditorNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RichTextEditorComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormElementLabelModule,
        InputMessageModule,
        SingleSelectPanelModule,
        ButtonsModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PlaceholdersConverterService, HtmlParserHelpers]
    })
      .overrideComponent(RichTextEditorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .overrideComponent(InputMessageComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RichTextEditorComponent);
      });
  }));

  describe('Init', () => {
    it('should create component', () => {
      expect(RTEComponent).toBeTruthy();
    });
  });

  describe('Simple inputs', () => {
    it('should toggle between primary & secondary designs', () => {
      expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
        '1px'
      );
      RTEComponent.type = RTEType.secondary;
      fixture.detectChanges();
      expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
        '0px'
      );
    });

    it('should insert hintMessage text', () => {
      RTEComponent.hintMessage = 'test hint';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(
        By.css('[b-input-message]')
      ).nativeElement;
      expect(messageElement.innerText).toEqual('test hint');
    });

    it('should insert warnMessage text over hintMessage text', () => {
      RTEComponent.hintMessage = 'test hint';
      RTEComponent.warnMessage = 'test warn';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(
        By.css('[b-input-message]')
      ).nativeElement;
      expect(messageElement.innerText).toEqual('test warn');
    });
  });

  describe('Label & placeholder', () => {
    it('should insert placeholder text', () => {});

    it('should update placeholder text', () => {});

    it('should insert label text', () => {
      const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
        .nativeElement;
      expect(labelElem.innerText).toEqual('label text');
    });

    it('should insert label text into placeholder slot if no placeholder text provided', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          placeholder: undefined
        })
      );
      fixture.detectChanges();

      const labelElem = fixture.debugElement.query(By.css('.bfe-label'));

      expect(labelElem).toBeFalsy();
    });

    it('should add * to placeholder text, when required is true and no label provided', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          label: undefined,
          required: true
        })
      );
      fixture.detectChanges();
    });

    // tslint:disable-next-line: max-line-length
    it('should add * to label text, and not placeholder, when required is true and both label and placeholder provided', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          required: true
        })
      );
      fixture.detectChanges();

      const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
        .nativeElement;

      const labelBeforeStyle = window.getComputedStyle(labelElem, '::after');
      const labelBeforeText = labelBeforeStyle.getPropertyValue('content');

      expect(labelElem.innerText).toEqual('label text');
      expect(labelBeforeText).toContain('*');
    });
  });

  describe('Disabled & Error', () => {
    it('should disable the editor when disabled is true', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          disabled: true
        })
      );

      fixture.detectChanges();

      expect(RTEnativeElement.classList).toContain('disabled');
    });

    it('should set invalid style when errorMessage is present', () => {
      RTEComponent.errorMessage = 'test error';
      fixture.detectChanges();

      const errorNativeElement = fixture.debugElement.query(By.css('.error'))
        .nativeElement;

      expect(RTEnativeElement.classList).toContain('error');
      expect(errorNativeElement.innerText).toContain('test error');
      expect(getComputedStyle(RTEeditorNativeElement).borderColor).toEqual(
        'rgb(229, 44, 81)'
      );
    });
  });

  describe('Min & Max height', () => {
    it('should set minimum and maximum editor height', () => {
      RTEComponent.minHeight = 300;
      RTEComponent.maxHeight = 600;
      fixture.detectChanges();
    });

    it('should disable min/max height when set to null', () => {
      RTEComponent.minHeight = null;
      RTEComponent.maxHeight = null;
      fixture.detectChanges();
    });
  });

  describe('Editor toolbar controls', () => {
    it('should display toolbar with controls present in controls array', () => {
      RTEComponent.controls = [BlotType.bold, BlotType.italic];
      fixture.detectChanges();
    });
  });

  describe('Value input', () => {
    it('should set the editor text to value input', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text'
        })
      );
      fixture.detectChanges();
    });
  });

  describe('FormControl setValue', () => {
    it('should let FormControl set value and then emit valueChanges', fakeAsync(() => {
      // rteControl.setValue('test');
      // tick(50);
      // expect(testComponent.rtrValue).toEqual('test');
      // flush();
    }));

    it('should not emit valueChanges when setting value with emitEvent false', fakeAsync(() => {
      // rteControl.setValue('test2', {
      //   emitEvent: false
      // });
      // tick(50);
      // expect(testComponent.rtrValue).not.toEqual('test2');
      // flush();
    }));
  });

  describe('FormControl propagateChange', () => {
    it('should propagate value', fakeAsync(() => {
      // RTEComponent.ngOnChanges(
      //   simpleChange({
      //     value: 'test text 1'
      //   })
      // );
      // tick(50);
      // expect(testComponent.rtrValue).toEqual('<p>test text 1 </p>');
      // flush();
    }));
  });

  describe('Events', () => {
    it('should output changed event', () => {
      fixture.detectChanges();
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text 8'
        })
      );
      expect(RTEComponent.changed.emit).toHaveBeenCalledWith(
        '<p>test text 8 </p>'
      );
    });
    it('should output focused event when editor is focused', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text 10'
        })
      );
      spyOn(RTEComponent.focused, 'emit');
      // RTEqlEditorNativeElement.dispatchEvent(new Event('focus'));
      expect(RTEComponent.focused.emit).toHaveBeenCalledWith(
        '<p>test text 10 </p>'
      );
    });
    it('should output blurred event when editor is blurred', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text 11'
        })
      );
      spyOn(RTEComponent.blurred, 'emit');
      // RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
      expect(RTEComponent.blurred.emit).toHaveBeenCalledWith(
        '<p>test text 11 </p>'
      );
    });
  });

  describe('Mentions', () => {
    RTEComponent.ngOnChanges(
      simpleChange({
        mentionsList: mentionsOptions
      })
    );
  });

  describe('Placeholders', () => {
    it('Should convert HTML to RTE', () => {
      RTEComponent.ngOnChanges(
        simpleChange({
          placeholderList: placeholderMock,
          value:
            '<p>Hi, <strong>My</strong> name is {{/root/firstName}} my job title</p>',
          controls: [BlotType.placeholder],
          disableControls: []
        })
      );

      fixture.detectChanges();
    });
  });

  describe('Chars counter', () => {
    it('Should display char counter', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text'
        })
      );
      fixture.detectChanges();

      const counterElement = fixture.debugElement.query(
        By.css('.length-indicator')
      ).nativeElement;

      expect(counterElement.textContent).toContain('10/30');
      expect(RTEnativeElement.classList).not.toContain('warn');
    });
    it('Should not display char counter if maxChars and minChars prop are undefined', () => {
      const counterElement = fixture.debugElement.query(
        By.css('.length-indicator')
      );
      expect(counterElement).toBeFalsy();
    });
    it('Should display a warning when approaching maxChars', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'test text 12345'
        })
      );
      fixture.detectChanges();
      const counterElement = fixture.debugElement.query(
        By.css('.length-indicator')
      ).nativeElement;
      expect(counterElement.classList).toContain('warn');
    });
    it('Should not allow to enter more than maxChars characters', () => {
      RTEComponent.maxChars = 30;
      RTEComponent.ngOnChanges(
        simpleChange({
          value: 'this_text_is_longer_than_20_characters'
        })
      );
      fixture.detectChanges();
      expect(RTEComponent.value).toEqual('');
    });
  });
});
