import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {
  InputEventType,
  InputTypes
} from '../../../form-elements/input/input.enum';
import {
  ButtonSize,
  ButtonType
} from '../../../buttons-indicators/buttons/buttons.enum';
import { RteLink } from '../rte.interface';
import { InputEvent } from '../../../form-elements/input/input.interface';
import { InputComponent } from '../../input/input.component';
import { checkUrl } from '../formats/link-blot';

@Component({
  selector: 'b-rte-link-editor',
  templateUrl: './rte-link-editor.component.html',
  styleUrls: ['./rte-link-editor.component.scss']
})
export class RteLinkEditorComponent {
  constructor() {}

  @ViewChild('textInput') private textInput: InputComponent;

  @Input() text: string;
  @Input() url: string;
  @Input() isEditing = false;

  @Output() linkUpdate: EventEmitter<any> = new EventEmitter<RteLink>();
  @Output() linkCancel: EventEmitter<any> = new EventEmitter<any>();

  inputTypes = InputTypes;
  buttonSize = ButtonSize;
  buttonType = ButtonType;

  private updateOnEvent = InputEventType.onChange; // onBlur

  focusTextInput(): void {
    (this.textInput.bInput as any).nativeElement.focus();
  }

  onTextChange(e: InputEvent) {
    if (e.event === this.updateOnEvent) {
      this.text = e.value as string;
    }
  }

  onUrlChange(e: InputEvent) {
    if (e.event === this.updateOnEvent) {
      this.url = e.value as string;
    }
  }

  onAdd(): void {
    const url = this.url ? checkUrl(this.url) : null;

    this.linkUpdate.emit({
      text: this.text,
      url
    });

    this.resetValues();
  }

  onCancel(): void {
    this.linkCancel.emit();
    this.resetValues();
  }

  private resetValues(): void {
    this.url = null;
    this.text = null;
  }
}
