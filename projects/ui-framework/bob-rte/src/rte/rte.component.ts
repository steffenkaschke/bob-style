import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {
  InputEventType,
  FormEvents,
  HtmlParserHelpers,
  isNotEmptyArray,
  isKey,
  Keys,
  ListChange,
  cloneArray
} from 'bob-style';

import { RTEbaseElement } from './rte.abstract';
import { PlaceholdersConverterService } from './placeholders.service';
import { RteService } from './rte.service';

import Tribute, { TributeOptions, TributeItem } from 'tributejs';

@Component({
  selector: 'b-rte',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextEditorComponent extends RTEbaseElement implements OnInit {
  constructor(
    public cd: ChangeDetectorRef,
    public placeholdersConverter: PlaceholdersConverterService,
    public rteService: RteService,
    public parserService: HtmlParserHelpers
  ) {
    super(cd, placeholdersConverter, rteService, parserService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // mentions

    if (isNotEmptyArray(this.mentionsList)) {
      this.tribute = new Tribute({
        values: this.mentionsList as any,
        lookup: 'displayName',
        fillAttr: 'displayName',
        requireLeadingSpace: true,
        allowSpaces: true,

        menuItemTemplate: function(item: TributeItem<any>) {
          return item.original.avatar
            ? `<span class="brte-mention-avatar" aria-hidden="true" style="background-image:url(${
                item.original.avatar
              })"></span><span>${item.string}</span>`
            : item.string;
        },

        selectTemplate: function(item: TributeItem<any>) {
          return (
            // prettier-ignore
            // tslint:disable-next-line: max-line-length
            `<a href="${item.original.link}" class="brte-mention fr-deletable" spellcheck="false" rel="noopener noreferrer" contenteditable="false" tabindex="-1">@${item.original.displayName}</a>`
          );
        },

        searchOpts: {
          pre: '<em class="match">',
          post: '</em>'
        }
      } as TributeOptions<any>);
    }

    // froala events

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

        // init mentions
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
        this.transmitValue(this.getEditor().html.get(), {
          eventType: [InputEventType.onFocus],
          eventName: FormEvents.focused,
          saveValue: true
        });
        this.inputFocused = true;
        this.cd.detectChanges();
      },

      blur: () => {
        this.transmitValue(this.getEditor().html.get(), {
          eventType: [InputEventType.onBlur],
          eventName: FormEvents.blurred,
          saveValue: true
        });
        this.inputFocused = false;
        this.cd.detectChanges();
      },

      click: (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // prevent mentions link clicks
        if (target.classList.contains('brte-mention')) {
          this.getEditor().selection.save();
          event.preventDefault();
          this.getEditor().toolbar.enable();
          this.getEditor().selection.restore();
        }
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
      }
    };
  }

  public onPlaceholderPanelOpen() {
    this.inputFocused = true;
    this.plchldrPnlTrgrFocused = true;
    this.getEditor().selection.save();
  }

  public onPlaceholderPanelClose() {
    this.plchldrPnlTrgrFocused = false;
  }

  public addPlaceholder(event: ListChange) {
    const placeholder = this.placeholdersConverter.getPlaceholderHtml(
      this.placeholderList,
      event.getSelectedIds()[0] as string
    );

    this.getEditor().selection.restore();
    this.getEditor().html.insert(placeholder);
    this.getEditor().undo.saveStep();

    this.placeholderList = cloneArray(this.placeholderList);
  }
}
