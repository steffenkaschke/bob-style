import { DialogButton } from '../dialog/dialog.interface';

export interface ConfirmationDialogConfig {
  buttonConfig: ConfirmationDialogButtons;
  title: string;
  class: string;
  message?: string;
  confirmationData?: any;
}

export interface ConfirmationDialogButtons {
  ok: DialogButton;
  cancel?: DialogButton;
}
