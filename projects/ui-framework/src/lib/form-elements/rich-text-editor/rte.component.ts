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
import { SelectGroupOption } from '../lists/list.interface';
import { SingleListComponent } from '../lists/single-list/single-list.component';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import quillLib, { QuillOptionsStatic } from 'quill';
import { Italic } from './formats/italic-blot';
import { LinkBlot, RteLinkFormats } from './formats/link-blot';
import { PlaceholderBlot } from './formats/placeholder-blot';
import {
  BlotType,
  RTEFontSize,
  RTEType,
  RTEControls,
  KeyboardKeys
} from './rte.enum';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { RteLink, UpdateRteConfig } from './rte.interface';
import { RTEformElement } from './rte-form-element.abstract';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { RtePlaceholder } from './placeholder-rte-converter/placeholder-rte-converter.interface';
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
  @Input() public disableControls: RTEControls[] = [RTEControls.placeholders];
  @Input() public placeholderList: SelectGroupOption[];

  @ViewChild('toolbar') private toolbar: ElementRef;
  @ViewChild('suffix') private suffix: ElementRef;
  @ViewChild('linkPanel') private linkPanel: PanelComponent;
  @ViewChild('linkEditor') private linkEditor: RteLinkEditorComponent;
  @ViewChild('placeholderPanel') private placeholderPanel: PanelComponent;

  public hasSuffix = true;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly panelSize = PanelSize;
  readonly RTEControls = RTEControls;
  readonly RTEFontSize = RTEFontSize;
  readonly panelDefaultPosVer = PanelDefaultPosVer;
  private blotsToDeleteWhole = [BlotType.link, BlotType.placeholder];
  private placeholderPanelOpen = false;

  // registering input/output transformers
  private initTransformers(): void {
    this.inputTransformers = [];
    this.outputTransformers = [this.rteUtilsService.cleanupHtml];

    if (
      this.placeholderList &&
      this.controls.includes(RTEControls.placeholders)
    ) {
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

  private addKeyBindings(): void {
    this.editor.keyboard.addBinding({ key: KeyboardKeys.backspace }, () => {
      if (this.blotsToDeleteWhole.length > 0) {
        this.currentBlot = this.rteUtilsService.getCurrentBlotData(this.editor);

        if (
          this.rteUtilsService.commonFormats(
            this.currentBlot.format,
            this.blotsToDeleteWhole
          )
        ) {
          this.rteUtilsService.selectBlot(this.currentBlot, this.editor);
          return false;
        }
      }
      return true;
    });
  }

  public changeFontSize(size: RTEFontSize) {
    this.editor.format('size', size === RTEFontSize.normal ? false : size);
    this.hasSizeSet = size !== RTEFontSize.normal;
  }

  private onLinkPanelOpen(): void {
    this.currentBlot = this.rteUtilsService.getCurrentBlotData(this.editor);

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
    const updateConfig: UpdateRteConfig = {
      replaceStr: this.selectedText,
      startIndex: this.selection.index,

      insertText: rteLink.text,
      format: {
        type: BlotType.link,
        value: rteLink.url
      },
      unformat: rteLink.url
        ? [BlotType.placeholder]
        : [...RteLinkFormats, BlotType.placeholder]
    };
    this.rteUtilsService.updateEditor(this.editor, updateConfig);
    this.linkPanel.closePanel();
  }

  public onLinkCancel(): void {
    this.linkPanel.closePanel();
  }

  public onPlaceholderPanelOpen() {
    this.placeholderPanelOpen = true;
    this.storeCurrentSelection();
  }

  public onPlaceholderSelectChange(
    selectGroupOptions: SingleListComponent
  ): void {
    if (this.placeholderPanelOpen) {
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
        unformat: undoFormats
      };

      this.rteUtilsService.updateEditor(this.editor, updateConfig);
      this.placeholderPanel.closePanel();
      this.placeholderPanelOpen = false;
    }
  }
}
