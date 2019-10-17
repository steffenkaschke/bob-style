import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
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
  joinArrays
} from '../../services/utils/functional-utils';
import { FroalaEditorDirective } from 'angular-froala-wysiwyg';
import { BlotType, RTEType } from './rte.enum';
import { FroalaOptions, RteMentionsOption } from './rte.interface';
import { merge } from 'lodash';
import FroalaEditor from 'froala-editor';

(FroalaEditor as any).DefineIcon('direction', { NAME: 'direction' });
(FroalaEditor as any).RegisterCommand('direction', {
  title: 'Direction',
  focus: false,

  callback: () => {
    alert('Hello!');
  }
});

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

  public length = 0;

  @ViewChild('editor', { read: FroalaEditorDirective, static: true })
  private editor: FroalaEditorDirective;

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

  @Input() public mentions: RteMentionsOption;

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() focused: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.data-type') @Input() public type: RTEType =
    RTEType.primary;

  ngOnInit(): void {
    console.log('ngOnInit', this.getEditor());

    this.options.events = {
      initialized: froalaDir => {
        console.log('ngOnInit initialized <<<<<');
      },
      'charCounter.update': () => {
        this.length = this.getEditor().charCounter.count();
        this.cd.detectChanges();
      },
      contentChanged: () => {
        this.cd.detectChanges();
        console.log('++++++++++contentChanged', this.getEditor().html.get());
        console.log('this.value', this.value);
        // this.value = this.getEditor().html.get();
        // this.transmitValue(this.getEditor().html.get());
      },
      focus: () => {
        if (this.focused.observers.length > 0) {
          this.focused.emit(this.value);
        }
      },
      blur: () => {
        if (this.blurred.observers.length > 0) {
          this.blurred.emit(this.value);
        }
        this.onTouched();
      }
    };
  }

  onNgChanges(changes: SimpleChanges): void {
    if (hasChanges(changes)) {
      applyChanges(
        this,
        changes,
        {
          minHeight: RTE_MINHEIGHT_DEF,
          maxHeight: RTE_MAXHEIGHT_DEF
        },
        ['options']
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
      this.controls = RTE_CONTROLS_ORDER.filter(
        (cntrl: BlotType) =>
          (this.controls || RTE_CONTROLS_DEF).includes(cntrl) &&
          !(this.disableControls || RTE_DISABLE_CONTROLS_DEF).includes(cntrl)
      );
      if (this.controls.includes(BlotType.list)) {
        this.controls = joinArrays(this.controls, [BlotType.ul, BlotType.ol]);
      }

      this.options.toolbarButtons = [...this.controls, 'alert'];
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getEditor(): FroalaEditor {
    return (this.editor as any)._editor;
  }
}
