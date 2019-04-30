import {
  Component,
  forwardRef,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  ViewChild,
  HostBinding,
  Input,
  ElementRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import quillLib, { QuillOptionsStatic } from 'quill';
import { LinkBlot } from './formats/link-blot';
import {
  BlotType,
  RTEFontSize,
  RTEType,
  RTEControls,
  KeyboardKeys
} from './rte.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RteLink, UpdateRteConfig } from './rte.interface';
import { RTEformElement } from './rte-form-element.abstract';
import { PanelComponent } from '../../overlay/panel/panel.component';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { PanelSize, PanelDefaultPosVer } from '../../overlay/panel/panel.enum';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';

quillLib.register(LinkBlot);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
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
export class RichTextEditorComponent extends RTEformElement
  implements AfterViewInit {
  constructor(
    private rteUtilsService: RteUtilsService,
    private DOM: DOMhelpers,
    rteUtils: RteUtilsService,
    changeDetector: ChangeDetectorRef,
    injector: Injector
  ) {
    super(rteUtils, changeDetector, injector);
  }

  @HostBinding('class') get classes() {
    return (
      (this.type === RTEType.secondary ? 'rte-secondary' : 'rte-primary') +
      (this.required ? ' required' : '') +
      (this.disabled ? ' disabled' : '') +
      (this.errorMessage ? ' error' : '')
    );
  }

  @Input() type?: RTEType = RTEType.primary;
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
  @Input() minHeight = 185;
  @Input() maxHeight = 295;

  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;
  @ViewChild('linkPanel') private linkPanel: PanelComponent;
  @ViewChild('linkEditor') private linkEditor: RteLinkEditorComponent;

  hasSuffix = true;

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly panelSize = PanelSize;
  readonly RTEControls = RTEControls;
  readonly RTEFontSize = RTEFontSize;
  readonly panelDefaultPosVer = PanelDefaultPosVer;

  private blotsToDeleteWhole = [BlotType.Link];

  ngAfterViewInit(): void {
    this.onRTEviewInit();

    const editorOptions: QuillOptionsStatic = {
      theme: 'snow',
      placeholder: this.rteUtilsService.getEditorPlaceholder(
        this.label,
        this.required
      ),
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        },
        clipboard: {
          matchVisual: false
        }
      }
    };

    setTimeout(() => {
      this.initEditor(editorOptions);
      this.addKeyBindings();
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }

  private addKeyBindings(): void {
    this.editor.keyboard.addBinding({ key: KeyboardKeys.backspace }, () => {
      if (this.blotsToDeleteWhole.length > 0) {
        this.currentBlot = this.rteUtilsService.getCurrentBlotData(this.editor);

        if (
          this.rteUtilsService.commonFormats(
            this.currentBlot.format,
            this.blotsToDeleteWhole
          )
        ) {
          this.rteUtilsService.selectBlot(this.currentBlot, this.editor);
          return false;
        }
      }

      return true;
    });
  }

  changeFontSize(size: RTEFontSize) {
    this.editor.format('size', size === RTEFontSize.normal ? false : size);
    this.hasSizeSet = size !== RTEFontSize.normal;
  }

  private onLinkPanelOpen(): void {
    this.currentBlot = this.rteUtilsService.getCurrentBlotData(this.editor);

    if (this.currentBlot.link) {
      this.selection = this.rteUtilsService.selectBlot(
        this.currentBlot,
        this.editor
      );
      this.selectedText = this.currentBlot.text;
    } else {
      this.selectedText = this.rteUtilsService.getSelectionText(
        this.editor,
        this.selection
      );
    }

    this.linkEditor.text = this.selectedText;
    this.linkEditor.url = this.currentBlot.link ? this.currentBlot.link : '';
    this.linkEditor.isEditing = !!this.currentBlot.link;

    this.editor.blur();
    setTimeout(() => {
      this.linkEditor.focusTextInput();
    }, 0);
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
