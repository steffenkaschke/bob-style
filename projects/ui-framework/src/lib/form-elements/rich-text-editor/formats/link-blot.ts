import Quill from 'quill';

const Inline = Quill.import('blots/inline');

export const RteLinkFormats = ['Link', 'color'];

export const checkUrl = (url: string) => {
  if (!url) {
    return null;
  }
  url = url.trim();
  return url ? (url.startsWith('http') ? url : `http://${url}`) : null;
};

export class LinkBlot extends Inline {
  static blotName = 'Link';
  static tagName = 'a';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('href', checkUrl(value));
    node.setAttribute('target', '_blank');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    return node;
  }

  static formats(node: HTMLElement) {
    return node.getAttribute('href');
  }
}
