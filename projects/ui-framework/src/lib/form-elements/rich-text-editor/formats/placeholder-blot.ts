import Quill from 'quill';
import { format } from 'url';
// import { get, isEqual, isUndefined } from 'lodash';

const Inline = Quill.import('blots/inline');

export class PlaceholderBlot extends Inline {
  static blotName = 'Placeholder';
  static tagName = 'span';

  static create(focusOption) {
    const node: HTMLElement = super.create();

    node.setAttribute('data-placeholder-id', focusOption.id);

    if (focusOption.category && focusOption.category !== 'undefined') {
      node.setAttribute('data-placeholder-category', focusOption.category);
    }

    node.setAttribute('contenteditable', 'false');

    return node;
  }

  static formats(node: HTMLElement) {
    return {
      id: node.getAttribute('data-placeholder-id'),
      category: node.getAttribute('data-placeholder-category')
    };
  }
}
