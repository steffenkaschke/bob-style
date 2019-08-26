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
    try {
      const node: HTMLElement = super.create();
      node.setAttribute('href', checkUrl(value));
      node.setAttribute('target', '_blank');
      return node;
    } catch {
      console.log('LinkBlot create failed');
    }
  }

  static formats(node: HTMLElement): string {
    return node && node.getAttribute('href');
  }
}
