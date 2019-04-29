import { Injectable } from '@angular/core';
import { chain, get, set, isEmpty, trim } from 'lodash';
import { RteCurrentContent, UpdateRteConfig, BlotData } from '../rte.interface';
import { Quill, RangeStatic } from 'quill';
import Parchment from 'parchment';
import { Blot } from 'parchment/src/blot/abstract/blot';
import { TextBlot } from 'quill/blots/text';

@Injectable()
export class RteUtilsService {
  constructor() {}

  getHtmlContent(editor: Quill): RteCurrentContent {
    const editorHtml = isEmpty(trim(editor.getText()))
      ? ''
      : chain(editor.root.innerHTML)
          // empty lines in the end
          .replace(
            /(<p([^\n\r\/<>]+)?><br><\/p>|<div([^\n\r\/<>]+)?><br><\/div>)+$/gi,
            ''
          )
          // empty tags
          .replace(/<([^>/][^>]+)([^\n\r\/<>]+)?>(\s+)?<\/\1>/gi, '')
          .replace(/(<em)/gi, '<i')
          .replace(/(<\/em>)/gi, '</i>')
          .value();

    return {
      body: editorHtml,
      plainText: trim(editor.getText())
    };
  }

  getCurrentSelection(editor: Quill): RangeStatic {
    return editor.getSelection()
      ? editor.getSelection()
      : { index: 0, length: 0 };
  }

  getSelectionText(editor: Quill, selection: RangeStatic): string {
    return get(selection, 'length') > 0
      ? editor.getText(selection.index, selection.length)
      : '';
  }

  getNativeRange(): Range {
    const selection = document.getSelection();
    return selection == null || selection.rangeCount <= 0
      ? null
      : selection.getRangeAt(0);
  }

  getCurrentBlot(): Blot {
    const nativeRange = this.getNativeRange();
    const node = nativeRange && nativeRange.endContainer;
    return node && Parchment.find(node);
  }

  getBlotIndex(blot: Blot, editor: Quill): number {
    return blot && blot.offset(editor.scroll);
  }

  getCurrentBlotData(editor: Quill): BlotData {
    const blot = this.getCurrentBlot();
    if (!blot) {
      return null;
    }
    const index = this.getBlotIndex(blot, editor);
    const format = editor.getFormat(index + 1);
    const text = (blot as TextBlot).text || '';

    return {
      index: index,
      length: text.length,
      text: text,
      format: format && Object.entries(format).length !== 0,
      link: format['Link']
    };
  }

  selectBlot(blot: BlotData, editor: Quill): RangeStatic {
    if (!blot.format) {
      return null;
    }
    editor.setSelection(blot.index, blot.length);
    return { index: blot.index, length: blot.length };
  }

  updateEditor(
    editor: Quill,
    updateConfig: UpdateRteConfig,
    insertSpaceAfterBlot = true
  ): void {
    const charAfterBlot = insertSpaceAfterBlot ? ' ' : '';
    set(
      updateConfig,
      'insertText',
      `${updateConfig.insertText}${charAfterBlot}`
    );
    editor.deleteText(updateConfig.startIndex, updateConfig.replaceStr.length);
    editor.insertText(updateConfig.startIndex, `${updateConfig.insertText}`);
    editor.removeFormat(
      updateConfig.startIndex,
      updateConfig.insertText.length - charAfterBlot.length
    );
    editor.formatText(
      updateConfig.startIndex,
      updateConfig.insertText.length - charAfterBlot.length,
      {
        [updateConfig.format.type]: updateConfig.format.value
      }
    );
    editor.setSelection(
      updateConfig.startIndex + updateConfig.insertText.length,
      0
    );
  }

  getEditorPlaceholder(label: string, required: boolean): string {
    return label ? label + (required ? ' *' : '') : '';
  }

  setEditorPlaceholder(editor: Quill, label: string, required: boolean): void {
    if (editor) {
      editor.root.dataset.placeholder = this.getEditorPlaceholder(
        label,
        required
      );
    }
  }
}
