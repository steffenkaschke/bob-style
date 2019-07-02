import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
  select,
  boolean
} from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
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
  <b-chip-list [chips]="chips"
               [config]="{
                  type: type,
                  selectable: selectable,
                  removable: removable,
                  disabled: disabled}">
  </b-chip-list>
`;

const note = `
  ## Chip List
  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---



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

const typeOptions = values(ChipType);

story.add(
  'Chip List',
  () => ({
    template: storyTemplate,
    props: {
      chips: object('chips', chips),
      type: select('type', typeOptions, ChipType.tag),
      removable: boolean('removable', true),
      selectable: boolean('selectable', true),
      disabled: boolean('disabled', false)
    },
    moduleMetadata: {
      imports: [ChipListModule, StoryBookLayoutModule, BrowserAnimationsModule]
    }
  }),
  { notes: { markdown: note } }
);
