import Quill from 'quill';
const Bold = Quill.import('formats/italic');

// import Bold from './bold';

// class Italic extends Bold {}
// Italic.blotName = 'italic';
// Italic.tagName = ['EMS', 'I'];

// export default Italic;

export class Italic extends Bold {
  static blotName = 'italic';
  static tagName = ['I', 'EM'];
}
