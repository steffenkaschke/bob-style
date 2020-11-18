import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogConfig, InputComponent } from 'bob-style';

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

  errMessage = '';

  ngOnInit() {
    this.config.buttonConfig.ok.disabled = true;
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  isValid(): boolean {
    return this.bInput.value === this.config.confirmationData.confirmationText;
  }

  onInputEvent() {
    if (this.isValid()) {
      this.config.buttonConfig.ok.disabled = false;
      return this.errMessage = '';
    }

    this.errMessage = this.config.confirmationData.errorMessage;
    this.config.buttonConfig.ok.disabled = true;
  }
}
