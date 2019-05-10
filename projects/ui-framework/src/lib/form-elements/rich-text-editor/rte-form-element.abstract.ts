import {
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import quillLib, { Quill, QuillOptionsStatic, RangeStatic } from 'quill';
import { RTEchangeEvent, RTEControls } from './rte.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { BlotData, RteCurrentContent } from './rte.interface';
import { BaseFormElement } from '../base-form-element';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';
quillLib.register(Block, true);

export abstract class RTEformElement extends BaseFormElement
  implements OnChanges {
  protected constructor(
    private rteUtils: RteUtilsService,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) {
    super();
  }

  @Input() public value: string;
  @Input() public maxChars: number;
  @Input() public controls: RTEControls[] = Object.values(RTEControls);
  @Input() public disableControls: RTEControls[] = [];
  @Input() public sendChangeOn: RTEchangeEvent = RTEchangeEvent.blur;
  @Input() private formControlName: any;
  @Input() private formControl: any;

  @ViewChild('quillEditor') private quillEditor: ElementRef;

  @Output() blurred: EventEmitter<any> = new EventEmitter<any>();
  @Output() focused: EventEmitter<any> = new EventEmitter<any>();
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public editor: Quill;
  public hasSizeSet = false;
  protected selection: RangeStatic;
  protected selectedText: string;
  protected currentBlot: BlotData;
  private latestOutputValue: string;
  private writingValue = false;
  private control: FormControl;

  protected inputTransformers: Function[] = [];
  protected outputTransformers: Function[] = [];
  protected outputFormatTransformer: Function = (val: string): any => val;

  protected onNgChanges(changes: SimpleChanges): void {}

  protected applyValue(val: string): void {
    if (this.value !== val || !this.latestOutputValue) {
      val =
        !!val.trim() &&
        this.inputTransformers.reduce(
          (previousResult, fn) => fn(previousResult),
          val
        );
      this.value = val || '';

      console.log(
        '<<<<<<<< applyValue',
        this.sendChangeOn,
        'value: "' + this.value + '"'
      );

      if (this.editor) {
        console.log('editor exists');
        this.editor.setContents(
          this.editor.clipboard.convert(this.value).insert(' ')
        );
      } else {
        this.writingValue = false;
        console.log('no editor');
      }
    }
  }

  protected transmitValue(condition: boolean): void {
    console.log(' >>>>>>> transmitValue', !this.writingValue && condition);
    console.log('this.writingValue', this.writingValue);
    console.log('transmitValue condition', condition);
    if (!this.writingValue && condition) {
      let newOutputValue = this.rteUtils.getHtmlContent(this.editor);
      newOutputValue = this.outputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        newOutputValue
      );

      if (
        !this.latestOutputValue ||
        this.latestOutputValue !== newOutputValue
      ) {
        this.latestOutputValue = newOutputValue;

        this.value = this.outputFormatTransformer(newOutputValue);
        console.log('transmitValue emitting change: ', this.value);
        this.changed.emit(this.value);
        this.propagateChange(this.value);
      }
    }
    this.writingValue = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('++++++++++ abstract ngOnChanges ', changes);
    if (changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      if (this.editor) {
        this.editor.enable(!this.disabled);
      }
    }
    if (changes.label) {
      this.label = changes.label.currentValue;
      this.rteUtils.setEditorPlaceholder(
        this.editor,
        this.label,
        this.required
      );
    }
    if (changes.required) {
      this.required = changes.required.currentValue;
      this.rteUtils.setEditorPlaceholder(
        this.editor,
        this.label,
        this.required
      );
    }
    if (changes.controls) {
      this.controls = changes.controls.currentValue;
    }
    if (changes.disableControls) {
      this.disableControls = changes.disableControls.currentValue;
    }
    if (changes.controls || changes.disableControls) {
      console.log('-- updating controls');
      this.controls = this.controls.filter(
        (cntrl: RTEControls) => !this.disableControls.includes(cntrl)
      );
    }
    this.onNgChanges(changes);
    if (changes.value) {
      console.log('---ngOnChanges value');
      this.applyValue(changes.value.currentValue);
    }
  }

  protected onRTEviewInit(): void {
    console.log('===onRTEviewInit', this.formControl, this.formControlName);
    if (this.formControl || this.formControlName) {
      const ngControl: NgControl = this.injector.get<NgControl>(
        NgControl as Type<NgControl>
      );

      if (ngControl) {
        this.control = ngControl.control as FormControl;
        this.sendChangeOn =
          this.control.updateOn === 'change'
            ? RTEchangeEvent.change
            : RTEchangeEvent.blur;
        console.log('*** ngControl control updateOn', this.control.updateOn);
      }
    }
  }

  private onEditorTextChange(): void {
    console.log('onEditorTextChange', this.sendChangeOn);
    this.transmitValue(this.sendChangeOn === RTEchangeEvent.change);
  }

  private onEditorSelectionChange(range: RangeStatic): void {
    if (range) {
      const newSize = !!this.editor.getFormat(range).size;
      if (this.hasSizeSet !== newSize) {
        this.hasSizeSet = newSize;
        this.changeDetector.detectChanges();
      }
    }
  }

  private onEditorFocus(): void {
    this.focused.emit(this.outputFormatTransformer(this.latestOutputValue));
  }

  private onEditorBlur(): void {
    this.transmitValue(this.sendChangeOn === RTEchangeEvent.blur);

    if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.blur) {
      this.onTouched();
    }

    this.blurred.emit(this.outputFormatTransformer(this.latestOutputValue));
  }

  // this is part of ControlValueAccessor interface
  public writeValue(val: string): void {
    this.writingValue = true;
    console.log('---writeValue: "', val, '"');
    this.applyValue(val);
  }

  protected initEditor(options: QuillOptionsStatic): void {
    this.editor = new quillLib(this.quillEditor.nativeElement, options);

    this.editor.enable(!this.disabled);

    this.editor.on('text-change', () => {
      this.onEditorTextChange();
    });

    if (!!this.value) {
      console.log('---initEditor applyValue', this.sendChangeOn);
      this.applyValue(this.value);
    }

    this.editor.on('selection-change', range => {
      this.onEditorSelectionChange(range);
    });

    this.editor.root.addEventListener('focus', () => {
      this.onEditorFocus();
    });

    this.editor.root.addEventListener('blur', () => {
      this.onEditorBlur();
    });
  }
}
