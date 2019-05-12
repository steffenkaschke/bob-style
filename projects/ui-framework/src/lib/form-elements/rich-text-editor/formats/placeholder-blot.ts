import Quill from 'quill';

const Inline = Quill.import('blots/inline');

const padChar = '\xa0';

export const getCategoryText = (
  category: string,
  startSpaces = 0,
  endSpaces = 2
): string =>
  category
    ? padChar.repeat(startSpaces) + category + padChar.repeat(endSpaces)
    : '';

export const getPlaceholderText = (name: string, category: string): string =>
  padChar.repeat(2) +
  getCategoryText(category, 0, 2) +
  name +
  padChar.repeat(2);

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
    const id = node.getAttribute('data-placeholder-id');
    let category = node.getAttribute('data-placeholder-category');
    category = category ? category.replace(new RegExp(padChar, 'g'), '') : '';

    return {
      id,
      category
    };
  }
}
