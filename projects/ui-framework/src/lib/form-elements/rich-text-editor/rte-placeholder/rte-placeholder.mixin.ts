import { UpdateRteConfig, SpecialBlots } from '../rte-core/rte.interface';
import { BlotType } from '../rte-core/rte.enum';
import { PanelComponent } from '../../../overlay/panel/panel.component';
import { RteUtilsService } from '../rte-core/rte-utils.service';
import Quill, { RangeStatic } from 'quill';
import { SingleListComponent } from '../../lists/single-list/single-list.component';
import { PlaceholderRteConverterService } from './placeholder-rte-converter.service';
import {
  RtePlaceholderList,
  RtePlaceholder,
  RtePlaceholderUpdate
} from './placeholder-rte-converter.interface';

export class RtePlaceholderBlot {
  constructor() {}

  // implementing Base class properties & methods

  public placeholderRteConverterService: PlaceholderRteConverterService = new PlaceholderRteConverterService();
  public placeholderList: RtePlaceholderList[];
  public placeholderPanel: PanelComponent;
  public rteUtils: RteUtilsService;
  public selection: RangeStatic;
  public editor: Quill;
  public storeCurrentSelection: Function;
  public selectedText: string;
  public specialBlots: SpecialBlots;

  // instance methods

  public onPlaceholderPanelOpen(): void {
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
}
