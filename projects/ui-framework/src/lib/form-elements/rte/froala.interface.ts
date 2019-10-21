import { FroalaOptions } from './rte.interface';

// source: https://github.com/froala/wysiwyg-editor/issues/2369

export interface RegisterCommandParameters {
  title: string;
  icon: string;
  undo: boolean;
  focus: boolean;
  showOnMobile: boolean;
  refreshAfterCallback: boolean;
  callback: (buttonName: string) => void;
  refresh: (button: JQuery) => void;
}

export interface FroalaEdtr {
  opts: FroalaOptions;
  align: Align;
  button: Button;
  charCounter: ChartCounter;
  clean: Clean;
  codeView: CodeView;
  colors: Colors;
  commands: Commands;
  core: Core;
  cursor: Cursor;
  edit: Edit;
  editInPopup: EditInPopup;
  embedly: Embedly;
  emoticons: Emoticons;
  events: Events;
  file: File;
  fontFamily: FontFamily;
  fontSize: FontSize;
  format: Format;
  forms: Forms;
  fullscreen: Fullscreen;
  helpers: Helpers;
  html: HTML;
  image: Image;
  inlineClass: InlineClass;
  inlineStyle: InlineStyle;
  keys: Keys;
  language: Language;
  lineHeight: LineHeight;
  link: Link;
  lists: Lists;
  markers: Markers;
  modals: Modals;
  node: Node;
  paragraphFormat: Apply<string>;
  paragraphStyle: Apply<string>;
  placeholder: Placeholder;
  popups: Popups;
  position: Position;
  quote: Apply<string>;
  save: Save;
  selection: FroalaSelection;
  size: Size;
  snapshot: Snapshot;
  spellChecker: SpellChecker;
  table: Table;
  toolbar: Toolbar;
  tooltip: Tooltip;
  undo: Undo;
  video: Video;
  destroy(): object;
}

export interface ToolbarButtons {
  [key: string]: {
    buttons: string[];
    align?: string;
    buttonsVisible?: number;
  };
}

export interface EmoticonButton {
  code: string;
  desc: string;
}

export interface SpecialCharacterSet {
  title: string;
  list: {
    char: string;
    desc: string;
  }[];
}

interface Apply<T> {
  apply(value: T): void;
}

export type MediaAlign = 'left' | 'right' | 'center';
export type AlignType = 'left' | 'right' | 'center' | 'justify';

export interface Align {
  apply(alignType: AlignType): object;
  refresh(button: Element): object;
}

export interface Button {
  addButton(buttons: Commands[]): object;
  bulkRefresh(): void;
  buildList(buttons: Commands[]): object;
  bulkGroup(): void;
  bindCommands(element: Element): void;
  refresh(button: Element): void;
  hideActiveDropdowns(element: Element): void;
}

export interface ChartCounter {
  count(): number;
}

export interface Clean {
  html(dirtyHtml: string): string;
  tables(): void;
  lists(): void;
  invisibleSpaces(dirtyHtml: string): void;
}

export interface CodeView {
  isActive(): boolean;
  get(): string;
  toggle(): object;
}

export interface Colors {
  background(color: string): object;
  text(value: string): object;
  back(): void;
}

export interface Commands {
  bold(): object;
  clearFormatting(): object;
  indent(): object;
  insertHR(): object;
  italic(): object;
  outdent(): object;
  redo(): object;
  show(): object;
  strikeThrough(): object;
  subscript(): object;
  superscript(): object;
  underline(): object;
  undo(): object;
  selectAll(): object;
  moreText(): object;
  moreParagraph(): object;
  moreRich(): object;
  moreMisc(): object;
}

export interface Core {
  getXHR(url: string, method: string): XMLHttpRequest;
  injectStyle(style: string): object;
  isEmpty(): boolean;
  sameInstance(object: Element): boolean;
}

export interface Cursor {
  backspace(): object;
  enter(shiftPressed: boolean): object;
  del(): object;
  isAtEnd(): boolean;
  isAtStart(): boolean;
}

export interface Edit {
  off(): object;
  on(): object;
  isDisabled(): boolean;
  disableDesign(): void;
}

export interface EditInPopup {
  update(): void;
}

export interface Embedly {
  add(url: string): void;
  back(): void;
  get(): void;
  insert(): void;
  remove(): void;
  showInsertPopup(): void;
}

export interface Emoticons {
  insert(emoticon: string, image?: string): object;
  setEmoticonCategory(categoryId: string): void;
}

export interface Events {
  blurActive(): boolean;
  bindClick(element: Element, selector: string, handler: () => void): void;
  chainTrigger(name: string, eventParams: object, force: boolean): object;
  disableBlur(): object;
  enableBlur(): object;
  focus(): object;
  on(
    name: string,
    callback: (event: Event) => void | boolean,
    first: boolean
  ): object;
  trigger(name: string, args: any[], force: boolean): object;
}

export interface File {
  insert(link: string, text: string, response: object): object;
  upload(files: any[]): object;
}

export interface FontFamily extends Apply<string> {}

export interface FontSize extends Apply<string> {}

export interface FormatAttributes {
  [key: string]: any;
}
export interface Format {
  apply(tagName: string, attributes: FormatAttributes): object;
  applyStyle(
    cssProperty: string,
    cssAttributes: string | FormatAttributes
  ): object;
  is(tagName: string, attributes: FormatAttributes): boolean;
  remove(tagName: string, attributes: FormatAttributes): object;
  removeStyle(cssPropertyName: string): object;
  toggle(tagName: string, attributes: FormatAttributes): object;
}

export interface Fullscreen {
  isActive(): boolean;
  toggle(): object;
}

export interface Forms {
  applyStyle(
    className: string,
    formStyles: object,
    formMultipleStyles: boolean
  ): void;
}

export interface Helpers {
  isMobile(): boolean;
  isAndroid(): boolean;
  isBlackberry(): boolean;
  isIOS(): boolean;
  isMac(): boolean;
  isTouch(): boolean;
  isWindowsPhone(): boolean;
  scrollLeft(): number;
  scrollTop(): number;
  sanitizeURL(url: string): string;
}

export interface HTML {
  cleanEmptyTags(): object;
  get(keepMarkers?: boolean, keepClasses?: boolean): string;
  getSelected(): string;
  unwrap(): void;
  wrap(temp?: boolean, tables?: boolean, blockquote?: boolean): void;
  insert(html: string, clean?: boolean, doSplit?: boolean): object;
  set(html: string): object;
}

export type DisplayType = 'block' | 'inline';

export interface Image {
  align(alignType: AlignType): object;
  applyStyle(className: string): object;
  display(displayType: DisplayType): any;
  get(): object;
  insert(
    link: string,
    sanitize: boolean,
    data: { [key: string]: any },
    existingImage: any,
    response: object
  ): object;
  remove(image: any): object;
  setAlt(alternateText: string): object;
  setSize(width: string, height: string): object;
  upload(images: any[]): object;
}

export interface ImageManager {
  hide(): object;
  show(): object;
}

export interface InlineClass extends Apply<string> {}

export interface InlineStyle extends Apply<string> {}

export interface Keys {
  ctrlKey(event): boolean;
  isArrow(keyCode: number): boolean;
  isCharacter(keyCode: number): boolean;
}

export interface Language {
  translate(str: string): string;
}

export interface LineHeight extends Apply<number> {}

export interface Link {
  allSelected(): Element[];
  applyStyle(className: string): object;
  get(): Element;
  insert(
    href: string,
    text?: string,
    attributes?: { [key: string]: any }
  ): object;
  remove(): object;
}

export type ListType = 'OL' | 'UL';

export interface Lists {
  format(listType: ListType): object;
}

export interface Markers {
  insert(): object;
  insertAtPoint(event): void;
  place(range: Range, marker?: boolean, id?: string): object;
  remove(): object;
  split(): object;
}

export interface Modals {
  areVisible(modalInstance: Element): boolean;
  create(id: string, headTemplate: string, bodyTemplate: string): Element;
  get(id: string): Element;
  isVisible(id: string): boolean;
  show(id: string): void;
  hide(id: string, restoreSelection: boolean): void;
}

export interface Node {
  blockParent(node: Element): Element;
  clearAttributes(node: Element): Element;
  contents(node: Element): any[];
  deepestParent(node: Element, until?: Element, simpleEnter?: boolean): Element;
  hasClass(element: Element, className: string): boolean;
  hasFocus(node: Element): boolean;
  isBlock(node: Element): boolean;
  isElement(node: Element): boolean;
  isDeletable(node: Element): boolean;
  isEditable(node: Element): boolean;
  isEmpty(node: Element, ignoreMarkers?: boolean): boolean;
  isFirstSibling(node: Element, ignoreMarkers?: boolean): boolean;
  isLastSibling(node: Element, ignoreMarkers?: boolean): boolean;
  isList(node: Element, ignoreMarkers?: boolean): boolean;
  isVoid(node: Element): boolean;
}

export interface ParagraphFormat extends Apply<string> {}

export interface ParagraphStyle extends Apply<string> {}

export interface Placeholder {
  hide(): void;
  isVisible(): void;
  refresh(): object;
  show(): void;
}

export interface Popups {
  areVisible(): void;
  create(id: string, templateProperties: { [key: string]: any }): JQuery;
  get(id: string): JQuery;
  hide(id: string): boolean;
  hideAll(except?: string): object;
  isVisible(id: string): boolean;
  onHide(id: string, callback: () => void): object;
  onRefresh(id: string, callback: () => void): object;
  refresh(id: string): object;
  setContainer(id: string): void;
  show(
    id: string,
    leftOffset: number,
    topOffset: number,
    heigh: number
  ): object;
}

export interface Position {
  getBoundingRect(): Element;
  refresh(): object;
}

export interface Quote extends Apply<string> {}

export interface Save {
  force(): object;
  save(): object;
  reset(): object;
}

export interface FroalaSelection {
  blocks(): Element[];
  clear(): object;
  element(): HTMLElement;
  endElement(): Element;
  get(): Selection;
  inEditor(): boolean;
  info(element: Element): object;
  isCollapsed(): boolean;
  isFull(): boolean;
  ranges(index?: number): Range | Range[];
  restore(): object;
  save(): object;
  setAfter(node: Element): object;
  setAtEnd(node: Element): object;
  setAtStart(node: Element): object;
  setBefore(node: Element): object;
  text(): string;
}

export interface Size {
  refresh(): object;
  syncIframe(): object;
}

export interface Snapshot {
  equal(snapshot1: Snapshot, snapshot2: Snapshot): boolean;
  get(): Snapshot;
  restore(snapshot: Snapshot): object;
}

export interface SpellChecker {
  toggle(): void;
}

export interface Table {
  insert(rows: number, columns: number): object;
}

export interface Toolbar {
  enable(): object;
  disable(): object;
  hide(): object;
  show(): object;
  showInline(element?: Element, force?: boolean): object;
}

export interface Tooltip {
  bind(element: Element, selector: string, displayAbove?: boolean): object;
  hide(): object;
  to(element: Element, displayAbove?: boolean): object;
}

export interface Undo {
  canDo(): boolean;
  canRedo(): boolean;
  reset(): object;
  saveStep(): object;
}

export interface Video {
  align(alignType: AlignType): object;
  display(displayType: DisplayType): object;
  get(): JQuery;
  insert(embeddedCode: string): object;
  remove(): object;
  setSize(width: string, height: string): object;
}
