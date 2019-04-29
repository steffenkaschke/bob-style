import Quill from 'quill';
import startsWith from 'lodash/startsWith';
import { RteLink } from '../rte.interface';

const Inline = Quill.import('blots/inline');

export class LinkBlot extends Inline {
  static blotName = 'Link';
  static tagName = 'a';

  static create(value: RteLink) {
    console.log('create', value);
    const node = super.create();
    node.setAttribute('href', this.checkUrl(value.url));
    node.setAttribute('target', '_blank');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    node.dataset.linkUrl = value.url;
    node.dataset.linkText = value.text;
    node.dataset.linkIndex = value.index;
    return node;
  }

  static checkUrl(url: string) {
    return startsWith(url, 'http') ? url : `http://${url}`;
  }

  static formats(node: HTMLElement) {
    return {
      text: node.dataset.linkText || node.innerText,
      url: node.dataset.linkUrl || node.getAttribute('href'),
      index: node.dataset.linkIndex && parseInt(node.dataset.linkIndex, 10)
    };
  }
}
