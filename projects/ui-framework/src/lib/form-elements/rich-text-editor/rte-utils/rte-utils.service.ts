import { Injectable } from '@angular/core';
import { UpdateRteConfig, BlotData } from '../rte.interface';
import { Quill, RangeStatic } from 'quill';
import { default as Delta } from 'quill-delta';
import Parchment from 'parchment';
import { Blot } from 'parchment/src/blot/abstract/blot';
import { TextBlot } from 'quill/blots/text';
import { keysFromArrayOrObject } from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';
import { BlotType } from '../rte.enum';

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

  getCurrentBlot(index: number = null, editor: Quill = null): Blot {
    let node: Node;
    if (index && editor) {
      node = editor.getLeaf(index)[0].domNode;
    } else {
      const nativeRange = this.getNativeRange();
      node = nativeRange && nativeRange.endContainer;
    }

    // if we have Element and not Node
    if (
      (node as HTMLElement).tagName &&
      ((node as HTMLElement).tagName === 'DIV' &&
        !(node as HTMLElement).className)
    ) {
      node = this.DOM.getDeepTextNode(node as HTMLElement) || node;
    }

    if (!node) {
      return;
    }

    let blot = Parchment.find(node);
    if (!blot) {
      blot = Parchment.find(node.parentElement);
    }
    return blot;
  }

  getBlotIndex(blot: Blot, editor: Quill): number {
    return blot && blot.offset(editor.scroll);
  }

  getCurrentBlotData(
    editor: Quill,
    skipformat = false,
    index: number = null,
    isEndIndex = false
  ): BlotData {
    const blot = this.getCurrentBlot(index, editor);
    if (!blot) {
      return null;
    }
    index = (!isEndIndex && index) || this.getBlotIndex(blot, editor);
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

  getBlotDataFromElement(element: any, editor: Quill): BlotData {
    const blot = element.__blot.blot;
    const index = blot.offset(editor.scroll);
    const domelement = blot.domNode;
    const text = domelement.innerText;
    const format = { [blot.statics.blotName]: blot.statics.formats() };

    return {
      index,
      length: text.length,
      text,
      format,
      element: domelement
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

  getCharAtIndex(index: number, editor: Quill, offsetMod = 0): string {
    const leaf = editor.getLeaf(index);
    const blot = leaf[0];
    if (!blot) {
      return null;
    }
    const offset = leaf[1] + offsetMod;
    const text = blot && blot.text;
    const char = blot && text && text.substr(offset, 1);

    // moving to next blot
    if (text && offset >= text.length) {
      return this.getCharAtIndex(index + 1, editor, -1);
    }

    return char;
  }

  charIsWhiteSpace(char: string): boolean {
    return !char || (char !== '\xa0' && /\s/.test(char));
  }

  spaceIfNeededAtIndex(index: number, editor: Quill): string {
    return !this.charIsWhiteSpace(this.getCharAtIndex(index, editor))
      ? ' '
      : '';
  }

  selectBlot(blot: BlotData, editor: Quill): RangeStatic {
    if (!blot.format) {
      return null;
    }
    editor.setSelection(blot.index, blot.length);
    return { index: blot.index, length: blot.length };
  }

  insertBlot(editor: Quill, config: UpdateRteConfig) {
    if (!config.insertText) {
      return null;
    }

    const originalFormat = editor.getFormat(config.startIndex); // +1
    const newFormat = {
      ...originalFormat,
      [config.format.type]: config.format.value
    };
    if (config.unformat) {
      config.unformat.forEach(format => {
        newFormat[format] = null;
      });
    }

    const spaceBefore = config.addSpaces
      ? this.spaceIfNeededAtIndex(config.startIndex - 1, editor)
      : '';

    const spaceAfter = config.addSpaces
      ? this.spaceIfNeededAtIndex(config.startIndex, editor)
      : '';

    const insertedTextLength =
      config.insertText.length + spaceBefore.length + spaceAfter.length;

    const originalEditorLength = editor.getLength();
    const retainLength =
      originalEditorLength -
      config.startIndex -
      config.replaceStr.length -
      insertedTextLength;

    const insertedTextEnd = config.startIndex + insertedTextLength;

    const futureEditorLength =
      originalEditorLength - config.replaceStr.length + insertedTextLength;

    editor.updateContents(
      new Delta()
        .retain(config.startIndex)
        .delete(config.replaceStr.length)
        .insert(spaceBefore)
        .insert(config.insertText, newFormat)
        .insert(spaceAfter)
        .retain(retainLength)
        .insert(
          insertedTextEnd + 1 === futureEditorLength &&
            !this.commonFormats(newFormat, config.noLinebreakAfter)
            ? '\n'
            : ''
        )
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
