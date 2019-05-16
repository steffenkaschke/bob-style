import { SpecialBlots, BlotData } from './rte.interface';
import { QuillKeyboardKeys, DOMkeyboardKeys } from './rte.enum';
import { RteUtilsService } from './rte-utils.service';
import Quill, { RangeStatic } from 'quill';

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

  // instance methods

  public addKeyBindings(): void {
    // before backspace default action

    this.editor.keyboard.addBinding(
      { key: QuillKeyboardKeys.backspace },
      (range, context) => {
        if (
          this.specialBlots.deleteAsWhole &&
          this.rteUtils.commonFormats(
            context.format,
            this.specialBlots.deleteAsWhole
          )
        ) {
          const currentSelection = this.rteUtils.getCurrentSelection(
            this.editor
          );
          this.currentBlot = this.rteUtils.getCurrentBlotData(
            this.editor,
            false,
            currentSelection.index - 1
          );

          if (
            // if in the end of blot, select blots in deleteAsWhole array
            (context.prefix === this.currentBlot.text &&
              this.rteUtils.commonFormats(
                this.currentBlot.format,
                this.specialBlots.deleteAsWhole
              )) ||
            // if in the middle of blot, select blots in treatAsWhole array
            (context.prefix !== this.currentBlot.text &&
              this.rteUtils.commonFormats(
                this.currentBlot.format,
                this.specialBlots.treatAsWhole
              ))
          ) {
            this.rteUtils.selectBlot(this.currentBlot, this.editor);
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
        // if some text selected inside blot, delete the blot
        const currentSelection = this.lastSelection;
        let currentBlot = this.lastCurrentBlot;

        if (
          currentSelection.length > 0 &&
          currentSelection.index > currentBlot.index &&
          currentSelection.index <= currentBlot.index + currentBlot.length &&
          this.rteUtils.commonFormats(
            currentBlot.format,
            this.specialBlots.treatAsWhole
          )
        ) {
          this.rteUtils.deleteRange(
            {
              index: currentBlot.index,
              length: currentBlot.length
            },
            this.editor
          );
          return;
        }

        // solve pseudo-cursor editing blot problem

        currentBlot = this.rteUtils.getCurrentBlotData(this.editor, false);
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
        event.key.toUpperCase() === QuillKeyboardKeys.delete
      ) {
        // const currentSelection = this.rteUtils.getCurrentSelection(
        //   this.editor
        // );
        const currentSelection = this.selection;

        const nextCharFormat = this.editor.getFormat(
          currentSelection.index + 1
        );

        if (
          this.rteUtils.commonFormats(
            nextCharFormat,
            this.specialBlots.deleteAsWhole
          ) ||
          this.rteUtils.commonFormats(
            nextCharFormat,
            this.specialBlots.treatAsWhole
          )
        ) {
          this.currentBlot = this.rteUtils.getCurrentBlotData(
            this.editor,
            true,
            currentSelection.index + 1
          );

          if (currentSelection.index === this.currentBlot.index) {
            // at the start of blot in deleteAsWhole array
            this.rteUtils.selectBlot(this.currentBlot, this.editor);
          } else if (
            currentSelection.index > this.currentBlot.index &&
            this.rteUtils.commonFormats(
              nextCharFormat,
              this.specialBlots.treatAsWhole
            )
          ) {
            // in the middle of blot in treatAsWhole array
            this.rteUtils.deleteRange(
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

        // this.currentBlot = this.rteUtils.getBlotDataFromElement(
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
          this.currentBlot = this.rteUtils.getBlotDataFromElement(
            element,
            this.editor,
            true
          );
          const currentSelection = this.rteUtils.getCurrentSelection(
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
}
