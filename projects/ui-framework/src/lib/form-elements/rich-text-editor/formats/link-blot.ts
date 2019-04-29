import Quill from 'quill';
import startsWith from 'lodash/startsWith';

const Inline = Quill.import('blots/inline');

export class LinkBlot extends Inline {
  static blotName = 'Link';
  static tagName = 'a';

  static create(url) {
    const node = super.create(url);
    node.setAttribute('href', this.checkUrl(url));
    node.setAttribute('target', '_blank');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    return node;
  }

  static checkUrl(url) {
    return startsWith(url, 'http') ? url : `http://${url}`;
  }

  static formats(node) {
    return node.getAttribute('href');
  }

  // format(name, value) {
  //   if (name !== this.statics.blotName || !value) {
  //     return super.format(name, value);
  //   }
  //   value = this.checkUrl(value);
  //   this.domNode.setAttribute('href', value);
  // }
}
