import { Injectable } from '@angular/core';
import { UpdateRteConfig, BlotData } from '../rte.interface';
import { Quill, RangeStatic } from 'quill';
import { default as Delta } from 'quill-delta';
import Parchment from 'parchment';
import { Blot } from 'parchment/src/blot/abstract/blot';
import { TextBlot } from 'quill/blots/text';
import { keysFromArrayOrObject } from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';

@Injectable()
export class RteUtilsService {
  constructor(private DOM: DOMhelpers) {}

  getHtmlContent(editor: Quill): string {
    return !editor.root.innerText.trim() ? '' : editor.root.innerHTML;
  }

  cleanupHtml(value: string): string {
    return (
      value
        // empty lines in the end
        .replace(
          /(<p([^\n\r\/<>]+)?><br><\/p>|<div([^\n\r\/<>]+)?><br><\/div>)+$/gi,
          ''
        )
        // empty tags
        .replace(/<([^>/][^>]+)([^\n\r\/<>]+)?>(\s+)?<\/\1>/gi, '')
    );
  }

  getCurrentSelection(editor: Quill): RangeStatic {
    return editor.getSelection() || { index: 0, length: 0 };
  }

  getSelectionText(editor: Quill, selection: RangeStatic): string {
    return selection.length > 0
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
    console.log('nativeRange', nativeRange);

    const node = nativeRange && nativeRange.endContainer;

    // if we have Element and not Node
    // if (
    //   (node as HTMLElement).tagName &&
    //   ((node as HTMLElement).tagName === 'DIV' &&
    //     !(node as HTMLElement).className)
    // ) {
    //   node = this.DOM.getDeepTextNode(node as HTMLElement) || node;
    // }

    // console.log(nativeRange);
    console.log('getCurrentBlot');
    console.dir(node);

    if (!node) {
      return;
    }

    let blot = Parchment.find(node);
    console.log('blot', blot);
    if (!blot) {
      console.log('no blot');
      blot = Parchment.find(node.parentElement);
    }
    return blot;
  }

  getBlotIndex(blot: Blot, editor: Quill): number {
    return blot && blot.offset(editor.scroll);
  }

  getCurrentBlotData(editor: Quill, skipformat = false): BlotData {
    const blot = this.getCurrentBlot();
    if (!blot) {
      return null;
    }
    const index = this.getBlotIndex(blot, editor);
    const text = (blot as TextBlot).text || '';
    const format = (!skipformat && editor.getFormat(index + 1)) || {};
    const node = blot.domNode;
    const element = (node as HTMLElement).classList
      ? (node as HTMLElement)
      : node.parentElement;

    return {
      index,
      length: text.length,
      text,
      format: (skipformat || Object.keys(format).length > 0) && format,
      node,
      element,
      link: format && format['Link']
    };
  }

  commonFormats(f1: string[] | {}, f2: string[] | {}): string[] {
    const f1keys = keysFromArrayOrObject(f1);
    const f2keys = keysFromArrayOrObject(f2);
    const common = f1keys.filter(x => f2keys.includes(x));
    return common.length > 0 && common;
  }

  deleteRange(range: RangeStatic, editor: Quill): Delta {
    return editor.updateContents(
      new Delta().retain(range.index).delete(range.length)
    );
  }

  selectBlot(blot: BlotData, editor: Quill): RangeStatic {
    if (!blot.format) {
      return null;
    }
    editor.setSelection(blot.index, blot.length);
    return { index: blot.index, length: blot.length };
  }

  insertBlot(editor: Quill, updateConfig: UpdateRteConfig) {
    if (!updateConfig.insertText) {
      return null;
    }

    const originalFormat = editor.getFormat(updateConfig.startIndex + 1);
    const newFormat = {
      ...originalFormat,
      [updateConfig.format.type]: updateConfig.format.value
    };
    if (updateConfig.unformat) {
      updateConfig.unformat.forEach(format => {
        newFormat[format] = null;
      });
    }

    const spaceBefore = updateConfig.addSpaces ? ' ' : '';
    const spaceAfter = spaceBefore;

    const insertedTextLength =
      updateConfig.insertText.length + spaceBefore.length + spaceAfter.length;

    const originalEditorLength = editor.getLength();
    const retainLength =
      originalEditorLength -
      updateConfig.startIndex -
      updateConfig.replaceStr.length -
      insertedTextLength;

    const insertedTextEnd = updateConfig.startIndex + insertedTextLength;

    const futureEditorLength =
      originalEditorLength -
      updateConfig.replaceStr.length +
      insertedTextLength;

    editor.updateContents(
      new Delta()
        .retain(updateConfig.startIndex)
        .delete(updateConfig.replaceStr.length)
        .insert(spaceBefore)
        .insert(updateConfig.insertText, newFormat)
        .insert(spaceAfter)
        .retain(retainLength)
        .insert(insertedTextEnd + 1 === futureEditorLength ? '\n' : '')
    );
    editor.setSelection(insertedTextEnd, 0);
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
