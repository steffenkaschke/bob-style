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
import { RteService } from './rte.service';
import { InputEventType, FormEvents } from '../form-elements.enum';
import { HtmlParserHelpers } from '../../services/html/html-parser.service';
import Tribute, { TributeOptions, TributeItem } from 'tributejs';
import { isNotEmptyArray, isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';

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
    if (isNotEmptyArray(this.mentionsList)) {
      this.tribute = new Tribute({
        values: this.mentionsList as any,
        lookup: 'displayName',
        fillAttr: 'displayName',
        requireLeadingSpace: true,
        allowSpaces: true,

        menuItemTemplate: function(item: TributeItem<any>) {
          return `<span class="brte-mention-avatar" aria-hidden="true" style="background-image:url(${
            item.original.avatar
          })"></span><span>${item.string}</span>`;
        },

        selectTemplate: function(item: TributeItem<any>) {
          // prettier-ignore
          // tslint:disable-next-line: max-line-length
          return `<a href="${item.original.link}" class="brte-mention fr-deletable" spellcheck="false" rel="noopener noreferrer" contenteditable="false">@${item.original.displayName}</a>`;
        },

        searchOpts: {
          pre: '<em class="match">',
          post: '</em>'
        }
      } as TributeOptions<any>);
    }

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

        if (isNotEmptyArray(this.mentionsList)) {
          this.tribute.attach(this.getEditorTextbox());

          this.getEditor().events.on(
            'keydown',
            (event: KeyboardEvent) => {
              if (isKey(event.key, Keys.enter) && this.tribute.isActive) {
                return false;
              }
            },
            true
          );
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

      'commands.after': (cmd: string) => {
        if (cmd === 'linkInsert') {
          const link = this.getEditor().link.get() as HTMLElement;
          link.setAttribute('spellcheck', 'false');
          link.classList.add('fr-deletable');
        }
      },

      keydown: (event: KeyboardEvent) => {
        if (isKey(event.key, Keys.enter)) {
        }
      },

      click: (event: MouseEvent) => {}
    };
  }
}
