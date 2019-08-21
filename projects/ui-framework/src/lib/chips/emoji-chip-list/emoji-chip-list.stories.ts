import {storiesOf, moduleMetadata} from '@storybook/angular';
// @ts-ignore
import * as readme from './README.md';

import {EmojiChipListComponent} from './emoji-chip-list.component';
import {ComponentGroupType} from '../../consts';
import {EmojiFromCodePipe} from './emoji-from-code.pipe';

storiesOf(ComponentGroupType.Chips, module)
  .addDecorator(moduleMetadata({
    declarations: [EmojiChipListComponent],
    imports     : [],
    providers   : [EmojiFromCodePipe],
    schemas     : [],
  }))
  .add('Emoji chip list',
    () => ({
      component: EmojiChipListComponent,
      props: [
      ]
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
