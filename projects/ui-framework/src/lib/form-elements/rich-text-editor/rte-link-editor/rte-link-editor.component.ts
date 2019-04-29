import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  HostListener,
  OnInit
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
import has from 'lodash/has';

@Component({
  selector: 'b-rte-link-editor',
  templateUrl: './rte-link-editor.component.html',
  styleUrls: ['./rte-link-editor.component.scss']
})
export class RteLinkEditorComponent implements OnInit {
  constructor() {}

  @Input() displayText: string;
  @Input() rteSelection: number;
  @Output() linkUpdate: EventEmitter<RteLink> = new EventEmitter<RteLink>();
  @Output() linkCancel: EventEmitter<any> = new EventEmitter<any>();

  inputTypes = InputTypes;
  buttonSize = ButtonSize;
  buttonType = ButtonType;

  urlText: string;
  linksCache = {};

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (has(changes, 'displayText')) {
  //     this.displayText = changes.displayText.currentValue;
  //   }
  // }

  onDisplayTextChange(e: InputEvent) {
    if (e.event === InputEventType.onChange) {
      this.displayText = e.value as string;
    }
  }

  onUrlTextChange(e: InputEvent) {
    if (e.event === InputEventType.onBlur) {
      this.urlText = e.value as string;
    }
  }

  onAdd(): void {
    const url = this.urlText ? this.urlText.trim() : null;

    this.linkUpdate.emit({
      text: this.displayText,
      url: url
    });

    if (url) {
      this.linksCache[this.displayText] = {
        selection: this.rteSelection,
        url: this.urlText
      };
    } else {
      delete this.linksCache[this.displayText];
    }

    this.resetValues();

    console.log('onAdd', this.rteSelection);
    console.log('onAdd', this.linksCache);
  }

  onCancel(): void {
    this.linkCancel.emit();
    this.resetValues();

    console.log('onCancel', this.rteSelection);
    console.log('onCancel', this.linksCache);
  }

  private resetValues(): void {
    this.urlText = null;
    this.displayText = null;
  }
}
