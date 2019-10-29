import Quill from 'quill';
import { RtePlaceholderUpdate } from './placeholder-rte-converter.interface';
import { simpleUID } from '../../../services/utils/functional-utils';

const Inline = Quill.import('blots/inline');

export class PlaceholderBlot extends Inline {
  static blotName = 'Placeholder';
  static tagName = 'span';

  static create(focusOption: RtePlaceholderUpdate): HTMLElement {
    const node: HTMLElement = super.create();
    node.setAttribute('data-placeholder-id', focusOption.id);
    if (focusOption.category && focusOption.category !== 'undefined') {
      node.setAttribute('data-placeholder-category', focusOption.category);
    }
    if (focusOption.text) {
      node.setAttribute('data-text', focusOption.text);
    }
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-tag', simpleUID());

    return node;
  }

  static formats(node: HTMLElement): RtePlaceholderUpdate {
    if (!node || node.innerText.trim() === '') {
      return;
    }
    const id = node.getAttribute('data-placeholder-id');
    const category = node.getAttribute('data-placeholder-category');
    const tag = node.getAttribute('data-tag');
    const text = node.getAttribute('data-text');

    if (!id) {
      return;
    }

    return {
      id,
      category,
      tag,
      text
    };
  }
}
