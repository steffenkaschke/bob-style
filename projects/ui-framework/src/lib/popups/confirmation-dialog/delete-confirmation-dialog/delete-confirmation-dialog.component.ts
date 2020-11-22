import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogConfig, InputComponent, InputEventType } from 'bob-style';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogButtons } from '../confirmation-dialog.interface';

@Component({
  selector: 'b-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html'
})

export class DeleteConfirmationDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig,
    private translateService: TranslateService
  ) {}

  @ViewChild(InputComponent) bInput: InputComponent;

  valid$: Observable<boolean>;
  buttonConfig$: Observable<ConfirmationDialogButtons>;

  defaultLabel: string;
  defaultConfirmationText: string;

  private validitySubject: Subject<boolean> = new Subject();
  private sub: Subscription;

  ngOnInit() {
    this.valid$ = this.validitySubject.asObservable();
    this.setButtonsConfig();
    this.setDefaultValues();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.sub = merge(
      this.bInput.changed.pipe(
        filter((event) => event.event !== InputEventType.onBlur),
        debounceTime(500)
      ),
      this.bInput.changed.pipe(
        filter((event) => event.event === InputEventType.onBlur)
      )
    ).pipe(
      map(
        (event) =>
          event.value ===
          (this.config.confirmationData?.confirmationText ||
            this.defaultConfirmationText)
      ),
      distinctUntilChanged()
    ).subscribe(this.validitySubject);
  }

  private setButtonsConfig(): void {
    this.buttonConfig$ = this.valid$.pipe(
      startWith(false),
      map((valid) => {
        return {
          ...this.config.buttonConfig,
          cancel: {
            label: this.translateService.instant('common.cancel'),
            ...this.config.buttonConfig.cancel,
          },
          ok: {
            label: this.translateService.instant('common.ok'),
            ...this.config.buttonConfig.ok,
            disabled: !valid,
          },
        };
      })
    );
  }

  setDefaultValues(): void {
    this.defaultConfirmationText = this.config.confirmationData?.confirmationText ?
      this.config.confirmationData.confirmationText :
      this.translateService.instant('common.delete');
    this.defaultLabel = this.translateService.instant('bob-style.delete-confirmation.default.label', {
      confirmationText: this.config.confirmationData?.label ?
        this.config.confirmationData.label :
        this.defaultConfirmationText
    });
  }
}
