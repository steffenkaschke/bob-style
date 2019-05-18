import {
  Component,
  forwardRef,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  ViewChild,
  HostBinding,
  Input,
  ElementRef,
  SimpleChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge } from 'lodash';

import { PanelComponent } from '../../overlay/panel/panel.component';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { PanelSize, PanelDefaultPosVer } from '../../overlay/panel/panel.enum';
import { SingleListComponent } from '../lists/single-list/single-list.component';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import quillLib, { QuillOptionsStatic, RangeStatic } from 'quill';
import { default as Delta } from 'quill-delta';
import { Italic } from './formats/italic-blot';
import { LinkBlot, RteLinkFormats } from './formats/link-blot';
import { PlaceholderBlot } from './formats/placeholder-blot';
import {
  BlotType,
  RTEFontSize,
  RTEType,
  KeyboardKeys,
  UtilBlotType
} from './rte.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import {
  RteLink,
  UpdateRteConfig,
  BlotData,
  SpecialBlots
} from './rte.interface';
import { RTEformElement } from './rte-form-element.abstract';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import {
  RtePlaceholder,
  RtePlaceholderList,
  RtePlaceholderUpdate
} from './placeholder-rte-converter/placeholder-rte-converter.interface';
import { PlaceholderRteConverterService } from './placeholder-rte-converter/placeholder-rte-converter.service';

quillLib.register(LinkBlot);
quillLib.register(PlaceholderBlot);
quillLib.register(Italic);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rte.component.html',
  styleUrls: ['./style/rte.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent extends RTEformElement
  implements AfterViewInit {
  constructor(
    private placeholderRteConverterService: PlaceholderRteConverterService,
    public rteUtils: RteUtilsService,
    private DOM: DOMhelpers,
    changeDetector: ChangeDetectorRef,
    injector: Injector
  ) {
    super(rteUtils, changeDetector, injector);
  }

  @HostBinding('class') get classes() {
    return (
      (!this.type ? 'rte-primary' : 'rte-' + this.type) +
      (this.required ? ' required' : '') +
      (this.disabled ? ' disabled' : '') +
      (this.errorMessage ? ' error' : '')
    );
  }

  @Input() public type: RTEType = RTEType.primary;
  @Input() public minHeight = 185;
  @Input() public maxHeight = 295;
  @Input() public disableControls: BlotType[] = [
    BlotType.placeholder,
    // BlotType.color,
    BlotType.align,
    BlotType.direction
  ];
  @Input() public placeholderList: RtePlaceholderList[];

  @ViewChild('toolbar') private toolbar: ElementRef;
  @ViewChild('suffix') private suffix: ElementRef;
  @ViewChild('linkPanel') private linkPanel: PanelComponent;
  @ViewChild('linkEditor') private linkEditor: RteLinkEditorComponent;
  @ViewChild('placeholderPanel') private placeholderPanel: PanelComponent;

  public hasSuffix = true;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly panelSize = PanelSize;
  readonly BlotType = BlotType;
  readonly RTEFontSize = RTEFontSize;
  readonly panelDefaultPosVer = PanelDefaultPosVer;

  specialBlots: SpecialBlots = {
    treatAsWholeDefs: [BlotType.placeholder],
    deleteAsWholeDefs: [BlotType.link, BlotType.placeholder],
    noLinebreakAfterDefs: [BlotType.link, BlotType.align]
  };

  // registering input/output transformers
  private initTransformers(): void {
    this.inputTransformers = [];
    this.outputTransformers = [this.rteUtils.cleanupHtml];

    if (this.placeholderList && this.controls.includes(BlotType.placeholder)) {
      this.inputTransformers.push(
        this.placeholderRteConverterService.toRtePartial(this.placeholderList[0]
          .options as RtePlaceholder[])
      );

      this.outputTransformers.push(this.placeholderRteConverterService.fromRte);
    }
  }

  // this extends RTE Abstract's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (
      changes.placeholderList ||
      changes.controls ||
      changes.disableControls
    ) {
      this.initTransformers();
      this.writeValue(this.value);
    }
  }

  // this extends RTE Abstract's ngAfterViewInit
  onNgAfterViewInit(): void {
    merge(this.editorOptions, {
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        }
      },
      formats: Object.values(this.controls)
    });

    setTimeout(() => {
      this.initEditor(this.editorOptions);
      this.addKeyBindings();
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }

  public addKeyBindings(): void {
    //
    // before backspace default action
    this.editor.keyboard.addBinding(
      {
        key: KeyboardKeys.backspace
      },
      (range, context) => {
        if (this.specialBlots.deleteAsWhole || this.specialBlots.treatAsWhole) {
          this.storeCurrent(range, {
            index: this.selection ? this.selection.index - 1 : 0
          });

          if (this.checkBlot(this.selection, this.currentBlot)) {
            return false;
          }
        }

        return true;
      }
    );

    // after backspace default action
    this.editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        (this.specialBlots.deleteAsWhole || this.specialBlots.treatAsWhole) &&
        event.key.toUpperCase() === KeyboardKeys.backspace
      ) {
        this.storeCurrent();
        this.checkBlot(this.selection, this.currentBlot);

        if (this.currentBlot.formatIs(UtilBlotType.cursor)) {
          this.storeCurrent(true, {
            index: this.selection.index - 1
          });
          if (this.checkBlot(this.selection, this.currentBlot)) {
            return false;
          }
        }
      }
    });

    // after delete default action
    this.editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        (this.specialBlots.treatAsWhole || this.specialBlots.deleteAsWhole) &&
        event.key.toUpperCase() === KeyboardKeys.delete
      ) {
        this.storeCurrent(true, {
          index: this.selection ? this.selection.index + 1 : 1
        });
        if (!this.currentBlot) {
          return;
        }
        this.checkBlot(this.selection, this.currentBlot, true);
      }
    });

    // move cursor to the beginning or end of plceholder on click

    this.editor.root.addEventListener('click', event => {
      const element = event.target as any;
      if (this.specialBlots.treatAsWhole) {
        this.storeCurrent(true, {
          element
        });

        if (
          this.rteUtils.commonFormats(
            this.currentBlot.format,
            this.specialBlots.treatAsWhole
          ) &&
          this.selection.index > this.currentBlot.index &&
          this.selection.index < this.currentBlot.endIndex
        ) {
          if (
            this.selection.index <
            this.currentBlot.index + this.currentBlot.length / 2
          ) {
            this.editor.setSelection(this.currentBlot.index, 0);
          } else {
            this.editor.setSelection(this.currentBlot.endIndex + 1, 0);
          }
        }
      }
    });
  }

  private onLinkPanelOpen(): void {
    this.storeCurrent(false, true);

    if (this.currentBlot.link) {
      this.storeCurrentSelection(
        this.currentBlot.select(),
        this.currentBlot.text
      );
    } else {
      this.storeCurrentSelection();
    }

    this.linkEditor.text = this.selectedText;
    this.linkEditor.url = this.currentBlot.link ? this.currentBlot.link : '';
    this.linkEditor.isEditing = !!this.currentBlot.link;

    this.editor.blur();
    setTimeout(() => {
      this.linkEditor.focusTextInput();
    }, 0);
  }

  public onLinkUpdate(rteLink: RteLink): void {
    if (!this.selection) {
      return;
    }

    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,

      insertText: rteLink.text,
      format: {
        type: BlotType.link,
        value: rteLink.url
      },

      unformat: rteLink.url
        ? this.specialBlots.treatAsWhole
        : [...RteLinkFormats, ...this.specialBlots.treatAsWhole],
      addSpaces: this.selectedText.length === 0,
      noLinebreakAfter: this.specialBlots.noLinebreakAfter
    };

    this.rteUtils.insertBlot(this.editor, updateConfig);
    this.selection = null;
    this.linkPanel.closePanel();
  }

  public onPlaceholderPanelOpen() {
    this.storeCurrentSelection();
  }

  public onPlaceholderSelectChange(
    selectGroupOptions: SingleListComponent
  ): void {
    const undoFormats = Object.values(BlotType).filter(
      f => f !== BlotType.placeholder
    );
    const id = selectGroupOptions.focusOption.id;
    const name = selectGroupOptions.focusOption.value;
    const category = this.placeholderRteConverterService.getGroupDisplayName(
      this.placeholderList[0].options as RtePlaceholder[],
      id as string
    );
    const text = this.placeholderRteConverterService.getPlaceholderText(
      name,
      category
    );

    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: text,
      format: {
        type: BlotType.placeholder,
        value: {
          id,
          category,
          text
        } as RtePlaceholderUpdate
      },
      unformat: undoFormats,
      addSpaces: true,
      noLinebreakAfter: this.specialBlots.noLinebreakAfter
    };

    this.rteUtils.insertBlot(this.editor, updateConfig);
    this.selection = null;
    this.placeholderPanel.closePanel();
  }

  checkBlot(selection: RangeStatic, blot: BlotData, lookAhead = false) {
    const formatDeleteAsWhole = this.rteUtils.commonFormats(
      this.currentBlot.format,
      this.specialBlots.deleteAsWhole
    );
    const formatTreatAsWhole = this.rteUtils.commonFormats(
      this.currentBlot.format,
      this.specialBlots.treatAsWhole
    );

    if (
      (formatDeleteAsWhole[0] &&
        selection.index === (lookAhead ? blot.index : blot.endIndex) &&
        selection.length === 0) ||
      (formatTreatAsWhole[0] &&
        selection.index >= blot.index &&
        selection.index <= blot.endIndex &&
        selection.length === 0)
    ) {
      // check if we need to restore deleted text
      if (
        formatTreatAsWhole[0] &&
        blot.format[formatTreatAsWhole[0]].text &&
        blot.format[formatTreatAsWhole[0]].text.length !== blot.text.length
      ) {
        this.editor.updateContents(
          new Delta()
            .retain(blot.index)
            .delete(blot.length)
            .insert(blot.format[formatTreatAsWhole[0]].text, blot.format)
        );

        blot.length = blot.format[formatTreatAsWhole[0]].text.length;
        blot.endIndex = blot.index + blot.length;
      }

      this.rteUtils.selectBlot(blot, this.editor);
      return true;
    }

    return false;
  }
}
