import {
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnChanges
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import {
  RTE_OPTIONS_DEF,
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_MINHEIGHT_DEF,
  RTE_MAXHEIGHT_DEF,
  RTE_CONTROLS_ORDER
} from './rte.const';
import {
  cloneArray,
  hasChanges,
  notFirstChanges,
  applyChanges,
  joinArrays,
  isNullOrUndefined,
  cloneValue,
  firstChanges
} from '../../services/utils/functional-utils';
import { FroalaEditorDirective } from 'angular-froala-wysiwyg';
import { BlotType, RTEType } from './rte.enum';
import {
  RteMentionsOption,
  RtePlaceholderList,
  RtePlaceholder
} from './rte.interface';
import { merge } from 'lodash';
import FroalaEditor from 'froala-editor';
import { FroalaEdtr, FroalaOptions } from './froala.interface';
import { stringyOrFail } from '../../services/utils/transformers';
import { PlaceholdersConverterService } from './placeholders.service';
import { RteService } from './rte.service';
import { InputEventType } from '../form-elements.enum';
import { HtmlParserHelpers } from '../../services/html/html-parser.service';

// https://www.froala.com/wysiwyg-editor/examples/rtl-ltr-custom-button
const changeDirection = function(dir: string) {
  this.selection.save();
  this.html.wrap(true, true, true, true);
  this.selection.restore();
  const elements = this.selection.blocks();
  this.selection.save();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element !== this.el) {
      const curEl = this.$(element);
      curEl
        .css('direction', dir === 'rtl' ? dir : null)
        .css('text-align', dir === 'rtl' ? 'right' : null)
        .removeClass('fr-temp-div');

      if (curEl.attr('style') === '') {
        curEl.removeAttr('style');
      }
    }
  }

  this.html.unwrap();
  this.selection.restore();
};

FroalaEditor.DefineIcon('rightToLeft');
FroalaEditor.RegisterCommand('rightToLeft', {
  icon: 'right to left',
  title: 'Direction',
  focus: true,
  undo: true,
  refreshAfterCallback: true,

  callback: function() {
    changeDirection.apply(this, ['rtl']);
  },

  refresh: function(btns: HTMLElement[]) {
    console.log('rightToLeft refresh', this.selection.blocks());

    // if (
    //   (this.selection.blocks()[0] as HTMLElement).style.cssText.includes('rtl')
    // ) {
    //   btns[0].classList.add('fr-active');
    // } else {
    //   btns[0].classList.remove('fr-active');
    // }
  }
});

FroalaEditor.DefineIcon('leftToRight');
FroalaEditor.RegisterCommand('leftToRight', {
  icon: 'left to right',
  title: 'Direction',
  focus: true,
  undo: true,
  refreshAfterCallback: true,

  callback: function() {
    changeDirection.apply(this, ['ltr']);
  },

  refresh: function(btns: HTMLElement[]) {
    console.log('leftToRight refresh', this.selection.blocks());

    // if (
    //   (this.selection.blocks()[0] as HTMLElement).style.cssText.includes('ltr')
    // ) {
    //   btns[0].classList.add('fr-active');
    // } else {
    //   btns[0].classList.remove('fr-active');
    // }
  }
});

export abstract class RTEbaseElement extends BaseFormElement
  implements OnChanges {
  constructor(
    public cd: ChangeDetectorRef,
    public placeholdersConverter: PlaceholdersConverterService,
    public rteService: RteService,
    public parserService: HtmlParserHelpers
  ) {
    super();
    this.baseValue = '';
    this.wrapEvent = false;
  }

  public length = 0;
  public editorValue: string;

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  protected editorDirective: FroalaEditorDirective;

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

  @Input() public mentionsList: RteMentionsOption;
  @Input() public placeholderList: RtePlaceholderList[];

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;

  writeValue(value: any): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes)) {
      applyChanges(
        this,
        changes,
        {
          minHeight: RTE_MINHEIGHT_DEF,
          maxHeight: RTE_MAXHEIGHT_DEF
        },
        ['options', 'value']
      );
    }

    if (changes.options) {
      merge(this.options, RTE_OPTIONS_DEF, changes.options.currentValue);
    }

    if (changes.placeholder) {
      this.options.placeholderText = this.placeholder;
    }

    if (changes.maxChars) {
      this.options.charCounterMax = this.maxChars || -1;
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight'])) {
      this.options.heightMin = this.minHeight - 40;
      this.options.heightMax = this.maxHeight - 40;
    }

    if (hasChanges(changes, ['controls', 'disableControls'])) {
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

      this.options.toolbarButtons = this.controls = RTE_CONTROLS_ORDER.filter(
        (cntrl: BlotType) =>
          (this.controls || RTE_CONTROLS_DEF).includes(cntrl) &&
          !(this.disableControls || RTE_DISABLE_CONTROLS_DEF).includes(cntrl)
      );
    }

    if (firstChanges(changes) || changes.placeholderList) {
      this.initTransformers();
    }

    if (changes.value || changes.placeholderList) {
      this.writeValue(changes.value.currentValue);
      this.transmitValue(this.editorValue, {
        eventType: [InputEventType.onWrite],
        saveValue: true
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected initTransformers(): void {
    this.inputTransformers = [
      stringyOrFail,

      this.parserService.cleanupHtml,

      (value: string) =>
        !value.includes('href')
          ? value
          : this.parserService.enforceAttributes(value, 'a', {
              class: 'fr-deletable',
              spellcheck: 'false',
              rel: 'noopener noreferrer'
            }),

      (value: string) =>
        this.parserService.linkify(
          value,
          'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'
        )
    ];
    this.outputTransformers = [this.parserService.cleanupHtml];

    if (
      this.placeholderList &&
      this.controls.includes(BlotType.placeholder) &&
      !this.disableControls.includes(BlotType.placeholder)
    ) {
      this.inputTransformers.push(
        this.placeholdersConverter.toRtePartial(this.placeholderList[0]
          .options as RtePlaceholder[])
      );

      this.outputTransformers.push(this.placeholdersConverter.fromRte);
    }
  }

  protected getEditor(): FroalaEdtr {
    return (this.editorDirective as any)._editor as FroalaEdtr;
  }

  protected getEditorElement(): HTMLElement {
    return (this.editorDirective as any)._element as HTMLElement;
  }
}
