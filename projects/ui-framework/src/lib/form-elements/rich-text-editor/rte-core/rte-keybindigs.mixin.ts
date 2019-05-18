import { SpecialBlots, BlotData } from './rte.interface';
import { QuillKeyboardKeys, UtilBlotType } from './rte.enum';
import { RteUtilsService } from './rte-utils.service';
import Quill, { RangeStatic } from 'quill';
import { default as Delta } from 'quill-delta';

export class RteKeybindings {
  constructor() {}

  // implementing Base class properties & methods

  public rteUtils: RteUtilsService;
  public editor: Quill;
  public specialBlots: SpecialBlots;
  public selection: RangeStatic;
  public currentBlot: BlotData;
  public lastSelection: RangeStatic;
  public lastCurrentBlot: BlotData;
  public storeCurrent: Function;

  // instance methods

  checkBlot(
    selection: RangeStatic,
    blot: BlotData,
    lookAhead = false
  ): boolean {
    const formatDeleteAsWhole = this.rteUtils.commonFormats(
      this.currentBlot.format,
      this.specialBlots.deleteAsWhole
    );
    const formatTreatAsWhole = this.rteUtils.commonFormats(
      this.currentBlot.format,
      this.specialBlots.treatAsWhole
    );

    if (
      (formatDeleteAsWhole &&
        selection.index === (lookAhead ? blot.index : blot.endIndex) &&
        selection.length === 0) ||
      (formatTreatAsWhole &&
        selection.index >= blot.index &&
        selection.index <= blot.endIndex &&
        selection.length === 0)
    ) {
      // check if we need to restore deleted text
      if (
        formatTreatAsWhole &&
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

  public addKeyBindings(): void {
    //
    // before backspace default action
    this.editor.keyboard.addBinding(
      {
        key: QuillKeyboardKeys.backspace
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
        event.key.toUpperCase() === QuillKeyboardKeys.backspace
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
        event.key.toUpperCase() === QuillKeyboardKeys.delete
      ) {
        this.storeCurrent(true, {
          index: this.selection ? this.selection.index + 1 : 1
        });
        console.log(this.selection, this.currentBlot);
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
}
