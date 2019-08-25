import {storiesOf, moduleMetadata} from '@storybook/angular';
import { object } from '@storybook/addon-knobs/angular';
// @ts-ignore
import * as readme from './README.md';

import {EmojiChipListComponent} from './emoji-chip-list.component';
import {ComponentGroupType} from '../../consts';
import {EmojiFromCodePipe} from './emoji-from-code.pipe';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';

const storyTemplate = `
<b-story-book-layout [title]="'Emoji Chip List'">
  <div>
    <b-emoji-chip-list
    [chips]="chips"
    ></b-emoji-chip-list>
  </div>
</b-story-book-layout>
`;

storiesOf(ComponentGroupType.Chips, module)
  .addDecorator(moduleMetadata({
    declarations: [
      EmojiChipListComponent,
      EmojiFromCodePipe
    ],
    imports     : [
      StoryBookLayoutModule
    ],
    providers   : [],
    schemas     : [],
  }))
  .add('Emoji chip list',
    () => ({
      template: storyTemplate,
      props: {
        chips: object('chips', [
          '1F45F',
          '1F452',
          '1F3A9',
          '1F393',
          '1F451',
          '1F392',
          '1F45D'
        ].map((emoji) => {
          return {
            emoji: emoji,
            number: Math.ceil(Math.random() * 500)
          };
        }))
      }
    }),
    {
      notes: {
        markdown: readme.default,
        markdownOptions: {
          breaks: true
        }
      },
    }
  );
