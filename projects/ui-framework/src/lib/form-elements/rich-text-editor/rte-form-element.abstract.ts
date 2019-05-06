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
import { PlaceholderRteConverterService } from './placeholder-rte-converter/placeholder-rte-converter.service';
import { get } from 'lodash';
import { SelectGroupOption } from '../lists/list.interface';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';
quillLib.register(Block, true);

export abstract class RTEformElement extends BaseFormElement
  implements OnChanges {
  protected constructor(
    private rteUtils: RteUtilsService,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector,
    private placeholderRteConverterService: PlaceholderRteConverterService
  ) {
    super();
  }

  @Input() value: string;
  @Input() private maxChars: number;
  @Input() private formControlName: any;
  @Input() private formControl: any;
  @Input() controls?: RTEControls[] = [
    RTEControls.size,
    RTEControls.bold,
    RTEControls.italic,
    RTEControls.underline,
    RTEControls.link,
    RTEControls.list,
    RTEControls.align,
    RTEControls.dir
  ];
  @Input() placeholderList: SelectGroupOption[];

  @ViewChild('quillEditor') quillEditor: ElementRef;

  @Output() blurred: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() focused: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();
  @Output() changed: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();

  editor: Quill;
  selection: RangeStatic;
  selectedText: string;
  currentBlot: BlotData;
  hasSizeSet = false;
  latestOutputValue: RteCurrentContent;
  writingValue = false;
  sendChangeOn = RTEchangeEvent.blur;
  private control: FormControl;

  ngOnChanges(changes: SimpleChanges): void {
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

  onRTEviewInit(): void {
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
    const newOutputValue = this.rteUtils.getHtmlContent(
      this.editor,
      this.controls
    );
    if (
      !this.latestOutputValue ||
      this.latestOutputValue.body !== newOutputValue.body
    ) {
      this.latestOutputValue = newOutputValue;
      this.changed.emit(newOutputValue);
      if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.change) {
        this.value = newOutputValue.body;
        this.propagateChange(newOutputValue);
      }
      this.writingValue = false;
    }
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
    this.focused.emit(this.latestOutputValue);
  }

  private onEditorBlur(): void {
    this.blurred.emit(this.latestOutputValue);
    if (!this.writingValue && this.sendChangeOn === RTEchangeEvent.blur) {
      this.value = this.latestOutputValue.body;
      this.propagateChange(this.latestOutputValue);
      this.onTouched();
    }
    this.writingValue = false;
  }

  applyValue(val: string): void {
    if (this.value !== val || !this.latestOutputValue) {
      this.value = val || '';
      if (this.editor) {
        if (this.controls.includes(RTEControls.placeholders)) {
          const placeholders = get(this.placeholderList, '[0].options');
          this.value = this.placeholderRteConverterService.toRte(
            this.value,
            placeholders
          );
        }
        this.editor.setContents(
          this.editor.clipboard.convert(this.value).insert(' ')
        );
      }
    }
  }

  writeValue(val: string): void {
    this.writingValue = true;
    this.applyValue(val);
  }

  initEditor(options: QuillOptionsStatic): void {
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
    });

    this.editor.root.addEventListener('focus', () => {
      this.onEditorFocus();
    });

    this.editor.root.addEventListener('blur', () => {
      this.onEditorBlur();
    });
  }
}
