import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { chipsMock } from '../chips.mock';
import { randomFromArray } from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { Chip } from '../chip.interface';
import { ChipType } from '../chip.enum';
import { ChipModule } from '../chip/chip.module';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

// const chips = chipsMock;
const chips = [...randomFromArray(chipsMock, 10), 'Rimming'].reduce(
  (acc, chip) => {
    acc.push({
      text: chip
    } as Chip);
    return acc;
  },
  []
);

const template = `
  <b-chip-list [chips]="chips">
  </b-chip-list>
`;

const note = `
  ## Chip List
  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string[] | array of selected chips | none
  options | string[] | array of all possible chips | none
  acceptNew | boolean | if the input accepts new entries | true
  label | string | label (on top of input) | none
  placeholder | string | placeholder (inide input) | none
  hintMessage | string | text below input | none
  warnMessage | string | warning text
  errorMessage | string | error text | none
  required | boolean | if input is required | false
  disabled | boolean | if input is disabled | false
  changed | Function | handler for event of type ChipInputChange ({value, added, removed}) | none


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip List'">
  <div style="padding: 30px;margin:auto;max-width:600px;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Chip List',
  () => ({
    template: storyTemplate,
    props: {
      chips: object('chips', chips)
    },
    moduleMetadata: {
      imports: [ChipListModule, StoryBookLayoutModule, BrowserAnimationsModule]
    }
  }),
  { notes: { markdown: note } }
);
