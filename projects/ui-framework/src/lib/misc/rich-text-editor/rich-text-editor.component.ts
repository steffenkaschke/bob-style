import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import quillLib, { Quill, QuillOptionsStatic, RangeStatic } from 'quill';
import 'quill-mention';
import { LinkBlot } from './formats/link-blot';
import { CapsuleBlot } from './formats/capsule-blot';
import { PanelComponent } from '../../overlay/panel/panel.component';
import { BlotType, FormatTypes } from './rich-text-editor.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RteCurrentContent, RteLink, UpdateRteConfig } from './rich-text-editor.interface';
import isEmpty from 'lodash/isEmpty';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { PanelSize } from '../../overlay/panel/panel.enum';
import {SelectGroupOption} from '../../form-elements/lists/list.interface';


const Block = quillLib.import('blots/block');
Block.tagName = 'DIV';

quillLib.register(Block, true);
quillLib.register(LinkBlot);
quillLib.register(CapsuleBlot);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {

  @Input() rteHtml: string;

  @ViewChild('quillEditor') quillEditor: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('linkPanel') linkPanel: PanelComponent;

  editor: Quill;
  selection: RangeStatic;
  selectedText: string;

  formatTypes = FormatTypes;
  buttonType = ButtonType;
  icons = Icons;
  iconColor = IconColor;
  panelSize = PanelSize;

  constructor(
    private rteUtilsService: RteUtilsService,
  ) {
  }

  ngOnInit(): void {
    const atValues = [
      { id: 1, value: '{{DisplayName}}' },
      { id: 2, value: 'Title' }
    ];
    const hashValues = [
      { id: 3, value: '{{DisplayName}}' },
      { id: 4, value: 'Title' }
    ];
    const editorOptions: QuillOptionsStatic = {
      modules: {
        toolbar: this.toolbar.nativeElement,
        mention: {
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ["$"],
          showDenotationChar: false,
          source: function (searchTerm, renderList, mentionChar) {
            let values;

            if (mentionChar === "$") {
              values = atValues;
              //values = `{{${atValues}}}`;
            } else {
              values = hashValues;
            }

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];
              for (let i = 0; i < values.length; i++) {
                if (values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) {
                  matches.push(values[i]);
                }
                renderList(matches, searchTerm);
              }
            }
          },
        },
      },
      theme: 'snow'
    };

    this.editor = new quillLib(this.quillEditor.nativeElement, editorOptions);

    if (!isEmpty(this.rteHtml)) {
      this.editor.clipboard.dangerouslyPasteHTML(this.rteHtml);
    }
  }

  getCurrentText(): RteCurrentContent {
    return this.rteUtilsService.getHtmlContent(this.editor);
  }

  toggleFormat(formatType: FormatTypes) {
    this.editor.focus();
    this.editor.format(formatType, !this.rteUtilsService.isSelectionHasFormat(this.editor, formatType));
  }

  onLinkPanelOpen(): void {
    this.editor.focus();
    this.selection = this.rteUtilsService.getCurrentSelection(this.editor);
    this.selectedText = this.rteUtilsService.getSelectionText(this.editor, this.selection);
    this.editor.blur();
  }

  onLinkUpdate(rteLink: RteLink): void {
    debugger;
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: rteLink.text,
      format: {
        type: BlotType.Link,
        value: rteLink.url,
      },
    };
    this.rteUtilsService.updateEditor(this.editor, updateConfig, false);
    this.linkPanel.closePanel();
  }

  onLinkCancel(): void {
    this.linkPanel.closePanel();
  }

  onCapsuleUpdate(capsule): void {
    this.editor.focus();
    this.selection = this.rteUtilsService.getCurrentSelection(this.editor);
    this.selectedText = this.rteUtilsService.getSelectionText(this.editor, this.selection);
    this.editor.blur();
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: capsule.text,
      format: {
        type: BlotType.Capsule,
        value: capsule.url,
      },
    };
    let x: any = this.getCurrentText();
    let toolbar = this.editor.getModule('mention');
    let t = x.body.replace(/<(?:.|\n)*?>/gm, '');
    console.log(t);
    debugger;
    this.rteUtilsService.updateEditor(this.editor, updateConfig, false);
  }

  makeTest() {
    console.log("ddd");
  }
}
