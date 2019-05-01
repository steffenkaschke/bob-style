import Quill from 'quill';

const Inline = Quill.import('blots/inline');

export class PlaceholderBlot extends Inline {

  static blotName = 'Placeholder';
  static tagName = 'span';

  static create(id) {
    const node = super.create();
    node.setAttribute('data-placeholder-id', id);
    return node;
  }

  static formats(node) {
    return node.getAttribute('data-placeholder-id');
  }
}
