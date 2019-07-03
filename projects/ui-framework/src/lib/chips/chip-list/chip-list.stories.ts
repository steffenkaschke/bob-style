import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
  select,
  boolean
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { chipsMock } from '../chips.mock';
import {
  randomFromArray,
  simpleUID,
  randomNumber
} from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { ChipType } from '../chips.enum';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const chips = [...randomFromArray(chipsMock, 10), 'Rimming'].map(chip => ({
  text: chip,
  id: simpleUID(),
  avatar: 'https://i.pravatar.cc/150?img=' + randomNumber(0, 70)
}));

const template = `
  <b-chip-list [chips]="chips"
               [config]="{
                  type: type,
                  removable: removable,
                  focusable: focusable,
                  selectable: selectable,
                  disabled: disabled}"
                  (removed)="onChipRemove($event)"
                  (clicked)="onChipClicked($event)"
                  (selected)="inChipSelected($event)"
                  (keyPressed)="onChipKeydown($event)">
  </b-chip-list>
`;

const note = `
  ## Chip List

  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  chips | Chip[] | Array of Chip objects | none
  config | ChipListConfig | list configuration (options common to all chips, including: type, removable, selectable, focusable, disabled) | none
  removed | &lt;Chip&gt; | handler for chip removed event | none
  clicked | &lt;Chip&gt; | handler for chip clicked event | none
  selected | &lt;Chip&gt; | handler for chip selected event (fired only if chip is selectable) | none
  keyPressed | &lt;Chip&gt; | handler for chip KeyDown event | none

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
      type: select('type', typeOptions, ChipType.avatar),
      removable: boolean('removable', true),
      selectable: boolean('selectable', true),
      focusable: boolean('focusable', true),
      disabled: boolean('disabled', false),
      chips: object('chips', chips),
      onChipRemove: action('Chip removed'),
      onChipClicked: action('Chip clicked'),
      inChipSelected: action('Chip selected'),
      onChipKeydown: action('Chip key pressed')
    },
    moduleMetadata: {
      imports: [ChipListModule, StoryBookLayoutModule, BrowserAnimationsModule]
    }
  }),
  { notes: { markdown: note } }
);
