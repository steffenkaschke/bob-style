import {
  Component,
  forwardRef,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import quillLib, { QuillOptionsStatic } from 'quill';
import { LinkBlot } from './formats/link-blot';
import { BlotType, RTEFontSize } from './rte.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RteLink, UpdateRteConfig } from './rte.interface';

import { RTEformElement } from './rte-form-element.abstract';
import { PanelComponent } from '../../overlay/panel/panel.component';

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
    rteUtils: RteUtilsService,
    changeDetector: ChangeDetectorRef,
    injector: Injector
  ) {
    super(rteUtils, changeDetector, injector);
  }

  @ViewChild('linkPanel') private linkPanel: PanelComponent;

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
    }, 0);
  }

  changeFontSize(size: RTEFontSize) {
    this.editor.format('size', size === RTEFontSize.normal ? false : size);
    this.hasSizeSet = size === RTEFontSize.normal ? false : true;
  }

  private onLinkPanelOpen(): void {
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
