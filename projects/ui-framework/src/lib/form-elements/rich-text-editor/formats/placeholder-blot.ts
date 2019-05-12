import Quill from 'quill';
import { get, isEqual, isUndefined } from 'lodash';

const Inline = Quill.import('blots/inline');

export class PlaceholderBlot extends Inline {
  static blotName = 'Placeholder';
  static tagName = 'span';

  static create(focusOption) {
    const node: HTMLElement = super.create();
    node.setAttribute('data-placeholder-id', focusOption.id);
    isEqual(get(focusOption, 'category'), 'undefined') || isUndefined(get(focusOption, 'category'))
      ? node.setAttribute('empty-placeholder-category', '')
      : node.setAttribute('data-placeholder-category', focusOption.category);
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
