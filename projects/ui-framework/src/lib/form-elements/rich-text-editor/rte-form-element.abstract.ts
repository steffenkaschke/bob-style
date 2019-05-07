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
  @Input() private formControlName: any;
  @Input() private formControl: any;

  @Input() public controls?: RTEControls[] = Object.values(RTEControls);

  @ViewChild('quillEditor') private quillEditor: ElementRef;

  @Output() blurred: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() focused: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() changed: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();

  public editor: Quill;
  protected selection: RangeStatic;
  protected selectedText: string;
  protected currentBlot: BlotData;
  protected hasSizeSet = false;
  private latestOutputValue: string;
  private writingValue = false;
  private sendChangeOn = RTEchangeEvent.blur;
  private control: FormControl;

  protected inputTransformers: Function[] = [];
  protected outputTransformers: Function[] = [];
  protected onSelectionChange: Function = (range: RangeStatic) => {};

  protected applyValue(val: string): void {
    if (this.value !== val || !this.latestOutputValue) {
      val = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        val
      );

      this.value = val || '';
      if (this.editor) {
        this.editor.setContents(
          this.editor.clipboard.convert(this.value).insert(' ')
        );
      }
    }
  }

  protected transmitValue(condition: boolean): void {
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

        this.changed.emit({
          body: newOutputValue
        });

        this.value = newOutputValue;
        this.propagateChange({
          body: newOutputValue
        });
      }
    }
    this.writingValue = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
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
    if (changes.value) {
      this.applyValue(changes.value.currentValue);
    }
  }

  protected onRTEviewInit(): void {
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
      }
    }
  }

  private onEditorTextChange(): void {
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
    this.focused.emit({ body: this.latestOutputValue });
  }

  private onEditorBlur(): void {
    this.transmitValue(this.sendChangeOn === RTEchangeEvent.blur);

    if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.blur) {
      this.onTouched();
    }

    this.blurred.emit({ body: this.latestOutputValue });
  }

  // this is part of ControlValueAccessor interface
  public writeValue(val: string): void {
    this.writingValue = true;
    this.applyValue(val);
  }

  protected initEditor(options: QuillOptionsStatic): void {
    this.editor = new quillLib(this.quillEditor.nativeElement, options);

    this.editor.enable(!this.disabled);

    this.editor.on('text-change', () => {
      this.onEditorTextChange();
    });

    if (!!this.value) {
      this.applyValue(this.value);
    }

    this.editor.on('selection-change', range => {
      this.onEditorSelectionChange(range);
      this.onSelectionChange(range);
    });

    this.editor.root.addEventListener('focus', () => {
      this.onEditorFocus();
    });

    this.editor.root.addEventListener('blur', () => {
      this.onEditorBlur();
    });
  }
}
