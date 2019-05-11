import Quill from 'quill';
const Bold = Quill.import('formats/italic');

export class Italic extends Bold {
  static blotName = 'italic';
  static tagName = ['I', 'EM'];
}
