import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from '../../dialog/dialog.component';
import { By } from '@angular/platform-browser';
import { ConfirmationDialogConfig } from '../confirmation-dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';
import { InputComponent } from 'bob-style';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let spyMatDialogRef: SpyObj<MatDialogRef<any>>;
  let config: ConfirmationDialogConfig;

  beforeEach(async(() => {
    spyMatDialogRef = createSpyObj('spyMatDialogRef', ['close']);

    config = {
      title: 'Confirm dialog title',
      class: 'confirm-test',
      buttonConfig: {
        ok: {
          label: 'Ok',
          action: () => true,
        },
      },
      confirmationData: {
        confirmationText: 'test',
        label: 'delete confirmation test',
        errorMessage: 'error message'
      },
      message: 'Confirm dialog message',
    };

    TestBed.configureTestingModule({
      declarations: [
        DeleteConfirmationDialogComponent,
        MockComponent(DialogComponent),
        MockComponent(InputComponent),
      ],
      imports: [NoopAnimationsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: config },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('config', () => {
    it('should set dialog title', () => {
      const dialog = fixture.debugElement.query(By.css('b-dialog'));
      expect(dialog.componentInstance.dialogTitle).toEqual(
        'Confirm dialog title'
      );
    });
    it('should set dialog buttonConfig', () => {
      const dialog = fixture.debugElement.query(By.css('b-dialog'));
      expect(dialog.componentInstance.dialogButtons).toEqual(
        config.buttonConfig
      );
    });
    it('should render message', () => {
      const message = fixture.debugElement.query(By.css('.message'));
      expect(message.nativeElement.innerText).toContain(
        'Confirm dialog message'
      );
    });
    it ('should show confirmation text input with label', () => {
      const input = fixture.debugElement.query(By.css('b-input'));
      expect(input.context.label).toEqual('delete confirmation test');
    });
    it('should show error msg', () => {
      const input = fixture.debugElement.query(By.css('b-input'));
      input.context.value = 'asd';
      const event = {
        value: 'asd'
      };
      input.componentInstance.changed.emit(event);
      expect(component.errMessage).toEqual('error message');
    });

    it('should not show error msg', () => {
      const input = fixture.debugElement.query(By.css('b-input'));
      input.context.value = 'test';
      const event = {
        value: 'test'
      };
      input.componentInstance.changed.emit(event);
      expect(component.errMessage).toEqual('');
    });
  });

  describe('OnDestroy', () => {
    it('should invoke close on dialogRef', () => {
      component.ngOnDestroy();
      expect(spyMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
