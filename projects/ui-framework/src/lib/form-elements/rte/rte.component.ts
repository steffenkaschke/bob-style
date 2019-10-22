import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { RTEbaseElement } from './rte.abstract';
import { PlaceholdersConverterService } from './placeholders.service';
import { stringyOrFail } from '../../services/utils/transformers';
import { RteService } from './rte.service';
import { InputEventType, FormEvents } from '../form-elements.enum';
import { HtmlParserHelpers } from '../../services/html/html-parser.service';

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
  constructor(
    public cd: ChangeDetectorRef,
    public placeholdersConverter: PlaceholdersConverterService,
    public rteService: RteService,
    public parserService: HtmlParserHelpers
  ) {
    super(cd, placeholdersConverter, rteService, parserService);
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
        this.transmitValue(this.getEditor().html.get(), {
          eventType: [InputEventType.onChange],
          saveValue: true
        });
      },

      focus: () => {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onFocus],
          eventName: FormEvents.focused,
          saveValue: true
        });
        this.inputFocused = true;
        this.getEditorElement().classList.add('focused');
      },

      blur: () => {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onBlur],
          eventName: FormEvents.blurred,
          saveValue: true
        });
        this.inputFocused = false;
        this.getEditorElement().classList.remove('focused');
      },

      'charCounter.update': () => {
        this.length = this.getEditor().charCounter.count();
        this.cd.detectChanges();
      },

      'commands.after': cmd => {
        if (cmd === 'linkInsert') {
          const link = this.getEditor().link.get() as HTMLElement;
          link.setAttribute('spellcheck', 'false');
          // link.classList.add('fr-deletable');
          this.getEditor().link.applyStyle('fr-deletable');
        }
      }
    };
  }
}
