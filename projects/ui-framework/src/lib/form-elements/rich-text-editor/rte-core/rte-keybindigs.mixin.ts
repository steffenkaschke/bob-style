import { SpecialBlots, BlotData } from './rte.interface';
import { KeyboardKeys } from './rte.enum';
import { RteUtilsService } from './rte-utils.service';
import Quill, { RangeStatic } from 'quill';

export class RteKeybindings {
  constructor() {}

  // implementing Base class properties & methods

  public rteUtilsService: RteUtilsService;
  public selection: RangeStatic;
  public editor: Quill;
  public specialBlots: SpecialBlots;
  public currentBlot: BlotData;

  // instance methods

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
          this.currentBlot = this.rteUtilsService.getCurrentBlotData(
            this.editor,
            true
          );

          if (
            // if in the end of blot, select blots in deleteAsWhole array
            (context.prefix === this.currentBlot.text &&
              this.rteUtilsService.commonFormats(
                context.format,
                this.specialBlots.deleteAsWhole
              )) ||
            // if in the middle of blot, select blots in treatAsWhole array
            (context.prefix !== this.currentBlot.text &&
              this.rteUtilsService.commonFormats(
                context.format,
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
        this.currentBlot = this.rteUtilsService.getCurrentBlotData(this.editor);

        // if some text selected inside blot, delete the blot
        if (
          this.selection.length > 0 &&
          this.selection.index > this.currentBlot.index &&
          this.selection.index <=
            this.currentBlot.index + this.currentBlot.length &&
          this.rteUtilsService.commonFormats(
            this.currentBlot.format,
            this.specialBlots.treatAsWhole
          )
        ) {
          this.rteUtilsService.deleteRange(
            {
              index: this.currentBlot.index,
              length: this.currentBlot.length
            },
            this.editor
          );
          return;
        }

        // solve pseudo-cursor editing blot problem
        if (this.currentBlot.element.className === 'ql-cursor') {
          this.editor.setSelection(this.currentBlot.index + 1, 0);
          this.editor.setSelection(this.currentBlot.index, 0);
        }
      }
    });

    // after delete default action
    this.editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        (this.specialBlots.treatAsWhole || this.specialBlots.deleteAsWhole) &&
        event.key.toUpperCase() === KeyboardKeys.delete
      ) {
        const currentSelection = this.rteUtilsService.getCurrentSelection(
          this.editor
        );
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
        if (
          (element as any).__blot &&
          this.specialBlots.treatAsWhole.includes(
            element.__blot.blot.statics.blotName
          )
        ) {
          this.currentBlot = this.rteUtilsService.getBlotDataFromElement(
            element,
            this.editor
          );
          const currentIndex = this.editor.getSelection().index;

          if (
            currentIndex > this.currentBlot.index &&
            currentIndex < this.currentBlot.index + this.currentBlot.length
          ) {
            if (
              currentIndex <
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
