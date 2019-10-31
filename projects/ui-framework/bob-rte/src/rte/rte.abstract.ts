import {
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnChanges,
  OnInit
} from '@angular/core';
import { merge } from 'lodash';

import {
  BaseFormElement,
  cloneArray,
  hasChanges,
  notFirstChanges,
  applyChanges,
  joinArrays,
  isNullOrUndefined,
  cloneValue,
  isNotEmptyArray,
  stringyOrFail,
  InputEventType,
  HtmlParserHelpers,
  SelectGroupOption,
  Icons,
  ButtonType,
  ButtonSize,
  SingleSelectPanelComponent,
  BELOW_END,
  ABOVE_END,
  IconColor,
  isNotEmptyObject
} from 'bob-style';

import {
  RTE_OPTIONS_DEF,
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_MINHEIGHT_DEF,
  RTE_MAXHEIGHT_DEF,
  RTE_CONTROLS_ORDER,
  RTE_TOOLBAR_HEIGHT
} from './rte.const';
import { BlotType, RTEType } from './rte.enum';
import { RteMentionsOption } from './rte.interface';
import { PlaceholdersConverterService } from './placeholders.service';

import { FroalaEditorDirective } from 'angular-froala-wysiwyg';
import { FroalaEdtr, FroalaOptions } from './froala.interface';
import Tribute from 'tributejs';

import './rte.direction';

export abstract class RTEbaseElement extends BaseFormElement
  implements OnChanges, OnInit {
  constructor(
    public cd: ChangeDetectorRef,
    public placeholdersConverter: PlaceholdersConverterService,
    public parserService: HtmlParserHelpers
  ) {
    super();
    this.baseValue = '';
    this.wrapEvent = false;
    this.emitOnWrite = true;
  }

  public length = 0;
  public editorValue: string;
  public tribute: Tribute<any>;
  public plchldrPnlTrgrFocused = false;

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly iconColor = IconColor;
  readonly plchldrPanelPosition = [BELOW_END, ABOVE_END];

  private cntrlsInited = false;

  protected toolbarButtons: HTMLElement[];

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  protected editorDirective: FroalaEditorDirective;
  @ViewChild('placeholderPanel', { static: false })
  protected placeholderPanel: SingleSelectPanelComponent;

  @Input() public value: string;
  @Input() public minChars = 0;
  @Input() public maxChars = -1;
  @Input() public controls: BlotType[] = cloneArray(RTE_CONTROLS_DEF);
  @Input() public disableControls: BlotType[] = cloneArray(
    RTE_DISABLE_CONTROLS_DEF
  );

  @Input() public minHeight = RTE_MINHEIGHT_DEF;
  @Input() public maxHeight = RTE_MAXHEIGHT_DEF;

  @Input() public options: FroalaOptions = cloneArray(RTE_OPTIONS_DEF);

  @Input() public mentionsList: RteMentionsOption[];
  @Input() public placeholderList: SelectGroupOption[];

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;

  public writeValue(value: any): void {
    if (value !== undefined) {
      this.editorValue = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );
    }
    if (isNullOrUndefined(this.editorValue) && this.baseValue !== undefined) {
      this.editorValue = cloneValue(this.baseValue);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes)) {
      applyChanges(
        this,
        changes,
        {
          minHeight: RTE_MINHEIGHT_DEF,
          maxHeight: RTE_MAXHEIGHT_DEF,
          controls: RTE_CONTROLS_DEF,
          disableControls: RTE_DISABLE_CONTROLS_DEF
        },
        ['options', 'value']
      );
    }

    if (changes.options) {
      this.updateEditorOptions(
        merge(RTE_OPTIONS_DEF, this.options, changes.options.currentValue)
      );
    }

    if (
      changes.placeholder ||
      (changes.label && this.hideLabelOnFocus) ||
      changes.hideLabelOnFocus ||
      (changes.required && this.hideLabelOnFocus)
    ) {
      this.updateEditorOptions(
        {
          placeholderText:
            this.hideLabelOnFocus && this.label
              ? !this.required
                ? this.label
                : this.label + '*'
              : this.placeholder || ' '
        },
        () => {
          this.getEditor().placeholder.refresh();
        }
      );
    }

    if (changes.maxChars) {
      this.updateEditorOptions({ charCounterMax: this.maxChars || -1 }, () => {
        this.getEditor().charCounter['_init']();
      });
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight'])) {
      this.updateEditorOptions(
        {
          heightMin: this.minHeight
            ? this.minHeight - RTE_TOOLBAR_HEIGHT
            : null,
          heightMax: this.maxHeight ? this.maxHeight - RTE_TOOLBAR_HEIGHT : null
        },
        () => {
          this.getEditor().size.refresh();
        }
      );
    }

    if (hasChanges(changes, ['controls', 'disableControls'])) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }

    if (changes.placeholderList) {
      this.initTransformers();
    }

    if (
      changes.mentionsList &&
      this.tribute &&
      isNotEmptyArray(changes.mentionsList.currentValue)
    ) {
      this.tribute['hideMenu']();
      this.tribute['collection'][0].values = this.mentionsList;
    }

    if (
      changes.value ||
      (changes.placeholderList && this.editorValue !== undefined)
    ) {
      this.writeValue(
        (changes.value && changes.value.currentValue) || this.editorValue
      );
      this.transmitValue(this.editorValue, {
        eventType: [InputEventType.onWrite],
        updateValue: true
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public ngOnInit(): void {
    if (!this.cntrlsInited) {
      this.initControls();
      this.updateToolbar();
      this.cntrlsInited = true;
    }
    if (this.inputTransformers.length === 0) {
      this.initTransformers();
    }
  }

  public placeholdersEnabled(): boolean {
    return (
      isNotEmptyArray(this.placeholderList) &&
      this.controls.includes(BlotType.placeholder)
    );
  }

  private initControls(): void {
    if (this.controls.includes(BlotType.list)) {
      this.controls = joinArrays(this.controls, [BlotType.ul, BlotType.ol]);
    }
    if (this.controls.includes(BlotType.direction)) {
      this.controls = joinArrays(this.controls, [
        BlotType.rightToLeft,
        BlotType.leftToRight
      ]);
    }
    if (this.disableControls.includes(BlotType.list)) {
      this.disableControls = joinArrays(this.disableControls, [
        BlotType.ul,
        BlotType.ol
      ]);
    }
    if (this.disableControls.includes(BlotType.direction)) {
      this.disableControls = joinArrays(this.disableControls, [
        BlotType.rightToLeft,
        BlotType.leftToRight
      ]);
    }

    this.controls = RTE_CONTROLS_ORDER.filter(
      (cntrl: BlotType) =>
        (this.controls || RTE_CONTROLS_DEF).includes(cntrl) &&
        !(this.disableControls || RTE_DISABLE_CONTROLS_DEF).includes(cntrl)
    );
  }

  private initTransformers(): void {
    this.inputTransformers = [
      stringyOrFail,

      (value: string): string =>
        !value.includes('href')
          ? value
          : this.parserService.enforceAttributes(value, 'a', {
              class: 'fr-deletable',
              target: '_blank',
              spellcheck: 'false',
              rel: 'noopener noreferrer',
              tabindex: '-1'
            }),

      (value: string): string =>
        !value.includes('brte-mention')
          ? value
          : this.parserService.enforceAttributes(value, '.brte-mention', {
              class: 'fr-deletable',
              target: null,
              spellcheck: 'false',
              rel: 'noopener noreferrer',
              contenteditable: false,
              tabindex: '-1'
            }),

      (value: string): string =>
        this.parserService.linkify(
          value,
          'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'
        )
    ];

    this.outputTransformers = [
      value => HtmlParserHelpers.prototype.cleanupHtml(value)
    ];

    if (this.placeholdersEnabled()) {
      this.inputTransformers.push(
        (value: string): string =>
          this.placeholdersConverter.toRte(value, this.placeholderList)
      );

      this.outputTransformers.push(this.placeholdersConverter.fromRte);
    }
  }

  public getEditor(): FroalaEdtr {
    return this.editorDirective['_editor'] as FroalaEdtr;
  }

  public getEditorElement(selector = null): HTMLElement | HTMLElement[] {
    const editorHostElem = this.editorDirective['_element'] as HTMLElement;
    if (!selector) {
      return editorHostElem;
    }

    const requestedElements = editorHostElem.querySelectorAll(selector);
    return requestedElements.length < 2
      ? requestedElements[0]
      : requestedElements;
  }

  protected getEditorTextbox(): HTMLElement {
    return this.getEditor().el as HTMLElement;
  }

  protected updateToolbar(): void {
    if (this.toolbarButtons) {
      this.toolbarButtons.forEach(b => {
        const cmd = b.getAttribute('data-cmd') as BlotType;
        if (!this.controls.includes(cmd)) {
          b.setAttribute('hidden', 'true');
        } else {
          b.removeAttribute('hidden');
        }
      });
    }
  }

  public updateEditorOptions(
    options: Partial<FroalaOptions>,
    callback: Function = null
  ): void {
    if (isNotEmptyObject(options)) {
      Object.assign(this.options, options);

      if (this.getEditor()) {
        Object.assign(this.getEditor().opts, options);

        if (callback) {
          callback();
        }
      }
    }
  }
}
