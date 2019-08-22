import {storiesOf, moduleMetadata} from '@storybook/angular';
import { object } from '@storybook/addon-knobs/angular';
// @ts-ignore
import * as readme from './README.md';

import {EmojiChipListComponent} from './emoji-chip-list.component';
import {ComponentGroupType} from '../../consts';
import {EmojiFromCodePipe} from './emoji-from-code.pipe';

storiesOf(ComponentGroupType.Chips, module)
  .addDecorator(moduleMetadata({
    declarations: [
      EmojiChipListComponent,
      EmojiFromCodePipe
    ],
    imports     : [],
    providers   : [],
    schemas     : [],
  }))
  .add('Emoji chip list',
    () => ({
      component: EmojiChipListComponent,
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
