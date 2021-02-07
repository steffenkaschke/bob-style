export enum Types {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

export enum Keys {
  meta = 'Meta',
  alt = 'Alt',
  control = 'Control',
  shift = 'Shift',
  enter = 'Enter',
  escape = 'Escape',
  tab = 'Tab',
  arrowdown = 'ArrowDown',
  arrowleft = 'ArrowLeft',
  arrowright = 'ArrowRight',
  arrowup = 'ArrowUp',
  end = 'End',
  home = 'Home',
  pagedown = 'PageDown',
  pageup = 'PageUp',
  backspace = 'Backspace',
  delete = 'Delete',
  space = ' ',
  comma = ',',
  semicolon = ';',
  dollar = '$',
  at = '@',
  caps = 'CapsLock',
}

export const metaKeys = [Keys.meta, Keys.alt, Keys.control, Keys.shift];

export const controlKeys = [
  Keys.meta,
  Keys.alt,
  Keys.control,
  Keys.shift,
  Keys.enter,
  Keys.escape,
  Keys.tab,
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.arrowup,
  Keys.end,
  Keys.home,
  Keys.pagedown,
  Keys.pageup,
  Keys.backspace,
  Keys.delete,
  Keys.caps,
];

export const arrowKeys = [
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.arrowup,
];

export const clickKeys = [Keys.enter, Keys.space];

export const deleteKeys = [Keys.backspace, Keys.delete];

export enum NativeEvents {
  click = 'click',
  dblclick = 'dblclick',
  mousedown = 'mousedown',
  mouseup = 'mouseup',
  mouseover = 'mouseover',
  mousemove = 'mousemove',
  mouseenter = 'mouseenter',
  mouseleave = 'mouseleave',
  mouseout = 'mouseout',
  keydown = 'keydown',
  keypress = 'keypress',
  keyup = 'keyup',
  focus = 'focus',
  blur = 'blur',
  change = 'change',
  input = 'input',
  submit = 'submit',
  reset = 'reset',
  resize = 'resize',
  scroll = 'scroll',
  select = 'select',
  dragstart = 'dragstart',
  drag = 'drag',
  dragenter = 'dragenter',
  dragleave = 'dragleave',
  dragover = 'dragover',
  drop = 'drop',
  dragend = 'dragend',
  touchstart = 'touchstart',
  touchend = 'touchend',
  touchmove = 'touchmove',
  touchenter = 'touchenter',
  touchleave = 'touchleave',
  touchcancel = 'touchcancel',
  focusin = 'focusin',
  focusout = 'focusout',
}

export const NativeMouseEvents = [
  NativeEvents.click,
  NativeEvents.dblclick,
  NativeEvents.mousedown,
  NativeEvents.mouseup,
  NativeEvents.mouseover,
  NativeEvents.mousemove,
  NativeEvents.mouseenter,
  NativeEvents.mouseleave,
  NativeEvents.mouseout,
];

export const NativeKeyboardEvents = [
  NativeEvents.keydown,
  NativeEvents.keypress,
  NativeEvents.keyup,
];

export const KEYCODES = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  FF_SEMICOLON: 59,
  FF_EQUALS: 61,
  QUESTION_MARK: 63,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META: 91,
  NUM_ZERO: 96,
  NUM_ONE: 97,
  NUM_TWO: 98,
  NUM_THREE: 99,
  NUM_FOUR: 100,
  NUM_FIVE: 101,
  NUM_SIX: 102,
  NUM_SEVEN: 103,
  NUM_EIGHT: 104,
  NUM_NINE: 105,
  NUM_MULTIPLY: 106,
  NUM_PLUS: 107,
  NUM_MINUS: 109,
  NUM_PERIOD: 110,
  NUM_DIVISION: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  FF_HYPHEN: 173,
  SEMICOLON: 186,
  DASH: 189,
  EQUALS: 187,
  COMMA: 188,
  HYPHEN: 189,
  PERIOD: 190,
  SLASH: 191,
  APOSTROPHE: 192,
  TILDE: 192,
  SINGLE_QUOTE: 222,
  OPEN_SQUARE_BRACKET: 219,
  BACKSLASH: 220,
  CLOSE_SQUARE_BRACKET: 221,
  IME: 229,
};
