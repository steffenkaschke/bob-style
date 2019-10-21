import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { RTEbaseElement } from './rte.abstract';

@Component({
  selector: 'b-rte',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RteComponent extends RTEbaseElement implements OnInit {
  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit(): void {
    this.options.events = {
      initialized: () => {
        if (this.options.tooltips === false) {
          this.getEditorElement()
            .querySelectorAll('button[title]')
            .forEach(b => {
              b.setAttribute('aria-label', b.getAttribute('title'));
              b.removeAttribute('title');
            });
        }
      },
      contentChanged: () => {
        const newValue = this.getEditor().html.get();
        super.writeValue(newValue);
        this.transmitValue(newValue);
      },
      focus: () => {
        if (this.focused.observers.length > 0) {
          this.focused.emit(this.value);
        }
        this.inputFocused = true;
        this.getEditorElement().classList.add('focused');
      },
      blur: () => {
        if (this.blurred.observers.length > 0) {
          this.blurred.emit(this.value);
        }
        this.onTouched();
        this.inputFocused = false;
        this.getEditorElement().classList.remove('focused');
      },
      'charCounter.update': () => {
        this.length = this.getEditor().charCounter.count();
        this.cd.detectChanges();
      }
    };
  }

  writeValue(value: string): void {
    super.writeValue(value);
    this.editorValue = this.value;
  }
}
