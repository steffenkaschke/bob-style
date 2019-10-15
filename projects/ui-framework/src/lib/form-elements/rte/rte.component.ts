import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  SimpleChanges,
  OnChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RTEType, BlotType } from '../rich-text-editor/rte-core/rte.enum';
import { GenericObject } from '../../types';
import {
  cloneArray,
  hasChanges,
  notFirstChanges,
  applyChanges
} from '../../services/utils/functional-utils';
import { FroalaEditorDirective } from 'angular-froala-wysiwyg';

const optionsDef: GenericObject = {
  heightMin: 185 - 40,
  heightMax: 295 - 40,

  charCounterCount: true,
  toolbarBottom: true,
  tooltips: false,
  listAdvancedTypes: false,

  linkAlwaysBlank: true,
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  linkInsertButtons: [],
  linkMultipleStyles: false,

  colorsText: [],

  toolbarButtons: [
    'fontSize',
    'bold',
    'italic',
    'underline',
    'insertLink',
    'formatOL',
    'formatUL',
    'align'
  ]
};

const controlsDef: BlotType[] = Object.values(BlotType);
const disableControlsDef: BlotType[] = [];

@Component({
  selector: 'b-rte',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RteComponent extends BaseFormElement implements OnInit {
  constructor(private cd: ChangeDetectorRef) {
    super();
    this.baseValue = '';
  }

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  public editor: FroalaEditorDirective;

  public options = cloneArray(optionsDef);
  public length = 0;

  @Input() public value: string;
  @Input() public minChars = 0;
  @Input() public maxChars: number;
  @Input() public controls: BlotType[] = cloneArray(controlsDef);
  @Input() public disableControls: BlotType[] = cloneArray(disableControlsDef);

  @Input() public minHeight = 185;
  @Input() public maxHeight = 295;

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;

  ngOnInit() {
    this.options.events = {
      'charCounter.update': () => {
        this.length = this.getEditor().charCounter.count();
        this.cd.detectChanges();
      },
      contentChanged: () => {
        this.value = this.getEditor().html.get();
        this.transmitValue();
      }
    };
  }

  onNgChanges(changes: SimpleChanges) {
    if (notFirstChanges(changes)) {
      applyChanges(this, changes);
    }

    if (changes.placeholder) {
      this.options = {
        ...this.options,
        placeholderText: this.placeholder
      };
    }

    if (changes.maxChars) {
      this.options = {
        ...this.options,
        charCounterMax: this.maxChars
      };
    }

    if (hasChanges(changes, ['minHeight', 'maxHeight'])) {
      this.options.heightMin = this.minHeight - 40;
      this.options.heightMax = this.maxHeight - 40;
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getEditor() {
    return (this.editor as any)._editor;
  }
}
