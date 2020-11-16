import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonSize, ButtonType, ConfirmationDialogConfig, Icons, InputComponent, InputEvent } from 'bob-style';

@Component({
  selector: 'b-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html'
})

export class DeleteConfirmationDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig
  ) {}

  @ViewChild('bInput') bInput: InputComponent;

  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;

  errMessage = '';

  ngOnInit() {
    const okCb = this.config.buttonConfig.ok.action;
    this.config.buttonConfig.ok.action = () => {
      if (this.isValid()) {
        return okCb();
      }

      this.errMessage = this.config.confirmationData.errorMessage;
      return Promise.resolve(false);
    };
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  isValid(): boolean {
    return this.bInput.value.length > 0 && this.errMessage.length === 0;
  }

  onInputEvent(input: InputEvent) {
    if (this.config.confirmationData.confirmationText === input.value) {
      return this.errMessage = '';
    }

    this.errMessage = this.config.confirmationData.errorMessage;
  }
}
