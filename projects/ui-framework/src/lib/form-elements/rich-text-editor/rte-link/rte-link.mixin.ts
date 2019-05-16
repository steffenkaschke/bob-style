import {
  BlotData,
  UpdateRteConfig,
  RteLink,
  SpecialBlots
} from '../rte-core/rte.interface';
import { BlotType } from '../rte-core/rte.enum';
import { RteLinkFormats } from './link-blot';
import { RteLinkEditorComponent } from './rte-link-editor.component';
import { PanelComponent } from '../../../overlay/panel/panel.component';
import { RteUtilsService } from '../rte-core/rte-utils.service';
import Quill, { RangeStatic } from 'quill';

export class RteLinkBlot {
  constructor() {}

  // implementing Base class properties & methods

  public linkPanel: PanelComponent;
  public linkEditor: RteLinkEditorComponent;
  public rteUtils: RteUtilsService;
  public selection: RangeStatic;
  public editor: Quill;
  public currentBlot: BlotData;
  public storeCurrentSelection: (...args: any[]) => void;
  public selectedText: string;
  public specialBlots: SpecialBlots;

  // instance methods

  public onLinkPanelOpen(): void {
    this.currentBlot =
      this.rteUtils.getCurrentBlotData(this.editor) || ({} as BlotData);

    if (this.currentBlot.link) {
      this.storeCurrentSelection(
        this.rteUtils.selectBlot(this.currentBlot, this.editor),
        this.currentBlot.text
      );
    } else {
      this.storeCurrentSelection();
    }

    this.linkEditor.text = this.selectedText;
    this.linkEditor.url = this.currentBlot.link ? this.currentBlot.link : '';
    this.linkEditor.isEditing = !!this.currentBlot.link;

    this.editor.blur();
    setTimeout(() => {
      this.linkEditor.focusTextInput();
    }, 0);
  }

  public onLinkUpdate(rteLink: RteLink): void {
    if (!this.selection) {
      return;
    }

    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,

      insertText: rteLink.text,
      format: {
        type: BlotType.link,
        value: rteLink.url
      },

      unformat: rteLink.url
        ? this.specialBlots.treatAsWhole
        : [...RteLinkFormats, ...this.specialBlots.treatAsWhole],
      addSpaces: this.selectedText.length === 0,
      noLinebreakAfter: this.specialBlots.noLinebreakAfter
    };

    this.rteUtils.insertBlot(this.editor, updateConfig);
    this.selection = null;
    this.linkPanel.closePanel();
  }
}
