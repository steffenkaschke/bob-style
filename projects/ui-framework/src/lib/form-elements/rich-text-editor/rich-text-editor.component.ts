import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  forwardRef,
  HostBinding,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isEmpty, has } from 'lodash';

import quillLib, { Quill, QuillOptionsStatic, RangeStatic } from 'quill';
import { LinkBlot } from './formats/link-blot';
import { PanelComponent } from '../../overlay/panel/panel.component';
import { BlotType, FormatTypes } from './rich-text-editor.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import {
  RteCurrentContent,
  RteLink,
  UpdateRteConfig
} from './rich-text-editor.interface';

import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { PanelSize } from '../../overlay/panel/panel.enum';

import { BaseFormElement } from '../../form-elements/base-form-element';

const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';

quillLib.register(Block, true);
quillLib.register(LinkBlot);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent extends BaseFormElement
  implements OnInit, OnChanges, AfterViewInit {
  constructor(private rteUtilsService: RteUtilsService) {
    super();
  }
  @HostBinding('class.required') @Input() required = false;
  @HostBinding('class.disabled') @Input() disabled = false;
  @HostBinding('class.error') @Input() errorMessage = undefined;

  @ViewChild('quillEditor') quillEditor: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;
  @ViewChild('linkPanel') linkPanel: PanelComponent;

  @Output() blur: EventEmitter<RteCurrentContent> = new EventEmitter<
    RteCurrentContent
  >();

  editor: Quill;
  selection: RangeStatic;
  selectedText: string;

  formatTypes = FormatTypes;
  buttonType = ButtonType;
  icons = Icons;
  iconColor = IconColor;
  panelSize = PanelSize;

  hasSuffix = true;

  ngOnInit(): void {
    const editorOptions: QuillOptionsStatic = {
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          // [
          // { size: ['small', false, 'large', 'huge'] },
          // 'bold',
          // 'italic',
          // 'underline',
          // 'link',
          // { list: 'ordered' },
          // { list: 'bullet' },
          // { align: [] },
          // { direction: 'rtl' }
          // ]
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        }
      },
      theme: 'snow',
      placeholder: this.label ? this.label + (this.required ? ' *' : '') : ''
    };

    this.editor = new quillLib(this.quillEditor.nativeElement, editorOptions);

    this.editor.on('text-change', () => {
      this.propagateChange(this.getCurrentText());
    });

    this.editor.root.addEventListener('blur', () => {
      this.blur.emit(this.getCurrentText());
    });

    if (!isEmpty(this.value)) {
      this.editor.clipboard.dangerouslyPasteHTML(this.value);
      this.propagateChange(this.value);
    }

    this.editor.enable(!this.disabled);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'disabled') && this.editor) {
      this.disabled = changes.disabled.currentValue;
      this.editor.enable(!this.disabled);
    }
    if (
      has(changes, 'value') &&
      this.editor &&
      !isEmpty(changes.value.currentValue)
    ) {
      this.value = changes.value.currentValue;
      this.editor.clipboard.dangerouslyPasteHTML(changes.value.currentValue);
      this.propagateChange(changes.value.currentValue);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasSuffix =
        this.suffix.nativeElement.children.length !== 0 ||
        this.suffix.nativeElement.childNodes.length !== 0
          ? true
          : false;
    }, 0);
  }

  getCurrentText(): RteCurrentContent {
    return this.rteUtilsService.getHtmlContent(this.editor);
  }

  toggleFormat(formatType: FormatTypes) {
    this.editor.focus();
    this.editor.format(
      formatType,
      !this.rteUtilsService.isSelectionHasFormat(this.editor, formatType)
    );
  }

  onLinkPanelOpen(): void {
    this.linkPanel.openPanel();
    this.editor.focus();
    this.selection = this.rteUtilsService.getCurrentSelection(this.editor);
    this.selectedText = this.rteUtilsService.getSelectionText(
      this.editor,
      this.selection
    );
    this.editor.blur();
  }

  onLinkUpdate(rteLink: RteLink): void {
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: rteLink.text,
      format: {
        type: BlotType.Link,
        value: rteLink.url
      }
    };
    this.rteUtilsService.updateEditor(this.editor, updateConfig, false);
    this.linkPanel.closePanel();
  }

  onLinkCancel(): void {
    this.linkPanel.closePanel();
  }
}
