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

import { PanelComponent } from '../../overlay/panel/panel.component';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { PanelSize, PanelDefaultPosVer } from '../../overlay/panel/panel.enum';
import { SingleListComponent } from '../lists/single-list/single-list.component';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import quillLib, { QuillOptionsStatic } from 'quill';
import { Italic } from './formats/italic-blot';
import { LinkBlot, RteLinkFormats } from './formats/link-blot';
import { PlaceholderBlot } from './formats/placeholder-blot';
import { BlotType, RTEFontSize, RTEType, KeyboardKeys } from './rte.enum';
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
  RtePlaceholderList
} from './placeholder-rte-converter/placeholder-rte-converter.interface';
import { PlaceholderRteConverterService } from './placeholder-rte-converter/placeholder-rte-converter.service';
import { getPlaceholderText } from './formats/placeholder-blot';

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
    private rteUtilsService: RteUtilsService,
    private DOM: DOMhelpers,
    rteUtils: RteUtilsService,
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
    BlotType.color,
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
    this.outputTransformers = [this.rteUtilsService.cleanupHtml];

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
    const editorOptions: QuillOptionsStatic = {
      theme: 'snow',
      placeholder: this.rteUtilsService.getEditorPlaceholder(
        this.label,
        this.required
      ),
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        },
        clipboard: {
          matchVisual: false
        }
      },
      formats: Object.values(this.controls)
    };

    setTimeout(() => {
      this.initEditor(editorOptions);
      this.addKeyBindings();
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }

  public addKeyBindings(): void {
    // before backspace default action

    this.editor.keyboard.addBinding(
      { key: KeyboardKeys.backspace },
      (range, context) => {
        if (
          this.specialBlots.deleteAsWhole &&
          this.rteUtilsService.commonFormats(
            context.format,
            this.specialBlots.deleteAsWhole
          )
        ) {
          const currentSelection = this.rteUtilsService.getCurrentSelection(
            this.editor
          );
          this.currentBlot = this.rteUtilsService.getCurrentBlotData(
            this.editor,
            false,
            currentSelection.index - 1
          );

          if (
            // if in the end of blot, select blots in deleteAsWhole array
            (context.prefix === this.currentBlot.text &&
              this.rteUtilsService.commonFormats(
                this.currentBlot.format,
                this.specialBlots.deleteAsWhole
              )) ||
            // if in the middle of blot, select blots in treatAsWhole array
            (context.prefix !== this.currentBlot.text &&
              this.rteUtilsService.commonFormats(
                this.currentBlot.format,
                this.specialBlots.treatAsWhole
              ))
          ) {
            this.rteUtilsService.selectBlot(this.currentBlot, this.editor);
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
        // if some text selected inside blot, delete the blot
        const currentSelection = this.lastSelection;
        let currentBlot = this.lastCurrentBlot;

        if (
          currentSelection.length > 0 &&
          currentSelection.index > currentBlot.index &&
          currentSelection.index <= currentBlot.index + currentBlot.length &&
          this.rteUtilsService.commonFormats(
            currentBlot.format,
            this.specialBlots.treatAsWhole
          )
        ) {
          this.rteUtilsService.deleteRange(
            {
              index: currentBlot.index,
              length: currentBlot.length
            },
            this.editor
          );
          return;
        }

        // solve pseudo-cursor editing blot problem

        currentBlot = this.rteUtilsService.getCurrentBlotData(
          this.editor,
          false
        );
        if (currentBlot.element.className === 'ql-cursor') {
          this.editor.setSelection(currentBlot.index + 1, 0);
          this.editor.setSelection(currentBlot.index, 0);
        }
      }
    });

    // after delete default action
    this.editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        (this.specialBlots.treatAsWhole || this.specialBlots.deleteAsWhole) &&
        event.key.toUpperCase() === KeyboardKeys.delete
      ) {
        // const currentSelection = this.rteUtilsService.getCurrentSelection(
        //   this.editor
        // );
        const currentSelection = this.selection;

        const nextCharFormat = this.editor.getFormat(
          currentSelection.index + 1
        );

        if (
          this.rteUtilsService.commonFormats(
            nextCharFormat,
            this.specialBlots.deleteAsWhole
          ) ||
          this.rteUtilsService.commonFormats(
            nextCharFormat,
            this.specialBlots.treatAsWhole
          )
        ) {
          this.currentBlot = this.rteUtilsService.getCurrentBlotData(
            this.editor,
            true,
            currentSelection.index + 1
          );

          if (currentSelection.index === this.currentBlot.index) {
            // at the start of blot in deleteAsWhole array
            this.rteUtilsService.selectBlot(this.currentBlot, this.editor);
          } else if (
            currentSelection.index > this.currentBlot.index &&
            this.rteUtilsService.commonFormats(
              nextCharFormat,
              this.specialBlots.treatAsWhole
            )
          ) {
            // in the middle of blot in treatAsWhole array
            this.rteUtilsService.deleteRange(
              {
                index: this.currentBlot.index,
                length: this.currentBlot.length
              },
              this.editor
            );
          }
        }
      }
    });

    // move cursor to the beginning or end of plceholder on click
    if (this.specialBlots.deleteAsWhole) {
      this.editor.root.addEventListener('click', event => {
        const element = event.target as any;

        // this.currentBlot = this.rteUtilsService.getBlotDataFromElement(
        //   element,
        //   this.editor,
        //   true
        // );

        if (
          (element as any).__blot &&
          this.specialBlots.treatAsWhole.includes(
            element.__blot.blot.statics.blotName
          )
        ) {
          this.currentBlot = this.rteUtilsService.getBlotDataFromElement(
            element,
            this.editor,
            true
          );
          const currentSelection = this.rteUtilsService.getCurrentSelection(
            this.editor
          );

          if (
            currentSelection.index > this.currentBlot.index &&
            currentSelection.index <
              this.currentBlot.index + this.currentBlot.length
          ) {
            if (
              currentSelection.index <
              this.currentBlot.index + this.currentBlot.length / 2
            ) {
              this.editor.setSelection(this.currentBlot.index, 0);
            } else {
              this.editor.setSelection(
                this.currentBlot.index + this.currentBlot.length + 1,
                0
              );
            }
          }
        }
      });
    }
  }

  private onLinkPanelOpen(): void {
    this.currentBlot =
      this.rteUtilsService.getCurrentBlotData(this.editor) || ({} as BlotData);

    if (this.currentBlot.link) {
      this.storeCurrentSelection(
        this.rteUtilsService.selectBlot(this.currentBlot, this.editor),
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

    this.rteUtilsService.insertBlot(this.editor, updateConfig);
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
    const text = getPlaceholderText(name, category);

    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,
      insertText: text,
      format: {
        type: BlotType.placeholder,
        value: selectGroupOptions.focusOption
      },
      unformat: undoFormats,
      addSpaces: true,
      noLinebreakAfter: this.specialBlots.noLinebreakAfter
    };

    this.rteUtilsService.insertBlot(this.editor, updateConfig);
    this.selection = null;
    this.placeholderPanel.closePanel();
  }
}
