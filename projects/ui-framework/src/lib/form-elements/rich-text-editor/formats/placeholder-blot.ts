import Quill from 'quill';

const Inline = Quill.import('blots/inline');

const padChar = '\xa0';

interface LocalFormat {
  id: string;
  category?: string;
  tag: string;
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
    node.setAttribute(
      'data-tag',
      Math.random()
        .toString()
        .slice(-4)
    );

    return node;
  }

  static formats(node: HTMLElement): LocalFormat {
    if (!node || node.innerText.trim() === '') {
      return;
    }
    const id = node.getAttribute('data-placeholder-id');
    let category = node.getAttribute('data-placeholder-category');
    category = category ? category.replace(new RegExp(padChar, 'g'), '') : '';
    const tag = node.getAttribute('data-tag');

    if (!id) {
      return;
    }

    return {
      id,
      category,
      tag
    };
  }
}
