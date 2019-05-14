import Quill from 'quill';

const Inline = Quill.import('blots/inline');
const TextBlot = Quill.import('blots/text');

const padChar = '\xa0';

interface LocalFormat {
  id: string;
  category?: string;
}

export const getPlaceholderText = (name: string, category: string): string =>
  padChar.repeat(2) +
  (category ? category + padChar.repeat(2) : '') +
  name +
  padChar.repeat(2);

export class PlaceholderBlot extends Inline {
  static blotName = 'Placeholder';
  static tagName = 'span';

  static create(focusOption: LocalFormat): HTMLElement {
    const node: HTMLElement = super.create();

    node.setAttribute('data-placeholder-id', focusOption.id);
    if (focusOption.category && focusOption.category !== 'undefined') {
      node.setAttribute('data-placeholder-category', focusOption.category);
    }
    node.setAttribute('contenteditable', 'false');

    return node;
  }

  static formats(node: HTMLElement): LocalFormat {
    if (node.innerText === '') {
      return;
    }
    const id = node.getAttribute('data-placeholder-id');
    let category = node.getAttribute('data-placeholder-category');
    category = category ? category.replace(new RegExp(padChar, 'g'), '') : '';

    if (!id) {
      return;
    }

    return {
      id,
      category
    };
  }
}
