import { BlotType } from './rte.enum';
import { dedupeArray, joinArrays } from '../../services/utils/functional-utils';
import { FroalaOptions } from './froala.interface';

export const RTE_CONTROLS_DEF: BlotType[] = dedupeArray(
  Object.values(BlotType)
);
export const RTE_DISABLE_CONTROLS_DEF: BlotType[] = [];

export const RTE_MINHEIGHT_DEF = 185;
export const RTE_MAXHEIGHT_DEF = 295;

export const RTE_CONTROLS_ORDER = joinArrays(
  [
    BlotType.size,
    BlotType.bold,
    BlotType.italic,
    BlotType.underline,
    BlotType.insertLink,
    BlotType.formatUL,
    BlotType.formatOL,
    BlotType.align,
    BlotType.rightToLeft,
    BlotType.leftToRight,
    BlotType.placeholder
  ],
  Object.values(BlotType)
);

export const RTE_OPTIONS_DEF: FroalaOptions = {
  heightMin: 185 - 40,
  heightMax: 295 - 40,

  enter: 1,
  initOnClick: false,
  theme: 'royal',

  attribution: false,
  toolbarBottom: true,
  toolbarSticky: false,
  charCounterCount: true,
  charCounterMax: -1,

  tooltips: false,
  shortcutsHint: false,

  imagePaste: false,
  imageDefaultAlign: 'left',
  imageDefaultWidth: 600,
  imageMaxSize: 1024 * 1024 * 3,
  imageMinWidth: 100,

  videoDefaultAlign: 'left',
  videoDefaultWidth: 600,
  videoMaxSize: 1024 * 1024 * 30,

  htmlAllowComments: false,
  htmlAllowedAttrs: [
    'align',
    'alt',
    'border',
    'cellpadding',
    'cellspacing',
    'colspan',
    'data-.*',
    'dir',
    'href',
    'id',
    'lang',
    'rel',
    'rowspan',
    'src',
    'target',
    'title',
    'valign',
    'style',
    'class',
    // 'contenteditable',
    'spellcheck',
    'rel'
  ],
  htmlAllowedEmptyTags: ['.fa', '.fr-emoticon', '.fr-inner'],
  htmlAllowedStyleProps: ['font-family', 'font-size', 'text-align'],
  htmlAllowedTags: [
    'a',
    'b',
    'br',
    'caption',
    'code',
    'div',
    'em',
    'figure',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    'i',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'rt',
    'span',
    'strike',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul'
  ],
  htmlExecuteScripts: false,
  htmlIgnoreCSSProperties: [],
  htmlRemoveTags: ['script', 'style'],
  htmlUntouched: true,

  pasteAllowedStyleProps: [],
  pasteDeniedAttrs: [],
  pasteDeniedTags: ['script', 'style'],
  pastePlain: false,

  wordDeniedTags: ['script', 'style'],

  scrollableContainer: 'body',

  listAdvancedTypes: false,

  linkAlwaysBlank: true,
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  linkInsertButtons: [],

  fontSizeSelection: false,
  fontSize: ['10', '12', '18', '30'],
  fontSizeDefaultSelection: '12',

  colorsText: [],

  fontFamily: {
    '\'Gotham SSm A\', \'Gotham SSm B\', \'Helvetica\'': 'Body font',
    '\'Sentinel SSm A\', \'Sentinel SSm B\', \'Helvetica\'': 'Heading font'
  },

  toolbarButtons: RTE_CONTROLS_DEF
};
