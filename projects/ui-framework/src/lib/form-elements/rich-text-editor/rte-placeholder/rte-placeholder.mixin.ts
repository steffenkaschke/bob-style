import { UpdateRteConfig, SpecialBlots } from '../rte-core/rte.interface';
import { BlotType } from '../rte-core/rte.enum';
import { PanelComponent } from '../../../overlay/panel/panel.component';
import { RteUtilsService } from '../rte-core/rte-utils.service';
import Quill, { RangeStatic } from 'quill';
import { SingleListComponent } from '../../lists/single-list/single-list.component';
import { PlaceholderRteConverterService } from './placeholder-rte-converter.service';
import {
  RtePlaceholderList,
  RtePlaceholder
} from './placeholder-rte-converter.interface';

import { getPlaceholderText } from './placeholder-blot';
import { SimpleChanges } from '@angular/core';

export class RtePlaceholderBlot {
  constructor() {}

  // implementing Base class properties & methods

  public placeholderRteConverterService = PlaceholderRteConverterService as any;
  public placeholderList: RtePlaceholderList[];
  public placeholderPanel: PanelComponent;
  public rteUtilsService: RteUtilsService;
  public selection: RangeStatic;
  public editor: Quill;
  public storeCurrentSelection: (...args: any[]) => void;
  public selectedText: string;
  public specialBlots: SpecialBlots;

  public outputTransformers: Function[];
  public inputTransformers: Function[];
  public controls: BlotType[];
  public doOnNgChanges: Function[];

  // this will extend RTE Abstract's ngOnChanges

  RtePlaceholderOnNgChanges = (changes: SimpleChanges): void => {
    console.log('wortks!');
    if (
      changes.placeholderList ||
      changes.controls ||
      changes.disableControls
    ) {
      // this.initTransformers();
      // this.writeValue(this.value);

      if (
        this.placeholderList &&
        this.controls.includes(BlotType.placeholder)
      ) {
        this.inputTransformers.push(
          this.placeholderRteConverterService.toRtePartial(this
            .placeholderList[0].options as RtePlaceholder[])
        );

        this.outputTransformers.push(
          this.placeholderRteConverterService.fromRte
        );
      }
    }
  }

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
