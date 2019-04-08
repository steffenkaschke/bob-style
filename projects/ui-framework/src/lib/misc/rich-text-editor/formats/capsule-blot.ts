import Quill from 'quill';
import startsWith from 'lodash/startsWith';

const Inline = Quill.import('blots/inline');

export class CapsuleBlot extends Inline {

  static blotName = 'Capsule';
  static tagName = 'div';

  static create(url) {
    const node = super.create();
    node.setAttribute('id', 'yossi');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    return node;
  }

  static formats(node) {
    return node.getAttribute('mat-chip');
  }
}
