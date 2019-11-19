import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
  select,
  boolean,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { simpleUID, randomNumber } from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { ChipType, ChipListAlign, ChipListSelectable } from '../chips.enum';
import { mockAvatar, mockNames } from '../../mock.const';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const chips = mockNames(10).map(chip => ({
  text: chip,
  id: simpleUID(),
  imageSource: mockAvatar(),
  selected: randomNumber() > 90,
  disabled: randomNumber() > 90,
}));
chips[2].selected = true;

const template = `
  <b-chip-list [chips]="chips"
               [chipListSelectable]="chipListSelectable"
               [activeIndex]="activeIndex"
               [config]="{
                  type: type,
                  align: align,
                  removable: removable,
                  focusable: focusable,
                  selectable: selectable,
                  disabled: disabled
                }"
                (removed)="onChipRemove($event)"
                (clicked)="onChipClicked($event)"
                (selected)="inChipSelected($event)"
                (keyPressed)="onChipKeydown($event)">
  </b-chip-list>
`;

let note = `
  ## Chip List

  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [chips] | Chip[] / string[] | Array of Chip objects (will also accept an array of strings) | &nbsp;
  [chipListSelectable] | chipListSelectable (single, multi) | single select (like radio buttons) or multi select | multi
  [activeIndex] | number | active index initializer | &nbsp;
  [config] | ChipListConfig | list configuration (options common to all chips, including: type, removable, selectable, focusable, disabled, align) | &nbsp;
  (removed) | EventEmitter&lt;Chip&gt; | emited on chip removed event | &nbsp;
  (clicked) | EventEmitter&lt;Chip&gt; | emited on chip clicked event | &nbsp;
  (selected) | EventEmitter&lt;Chip&gt; | emited on chip selected event (fired only if chip is selectable) | &nbsp;
  (keyPressed) | EventEmitter&lt;Chip&gt; | emited on chip KeyDown event | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip List'">
  <div style="max-width:500px;">
    ${template}
    <br>
    <p>
      * Set chip type to Avatar (in Knobs panel) to see Avatar Chip List
    </p>
  </div>

</b-story-book-layout>
`;

const typeOptions = Object.values(ChipType);
const alignOptions = Object.values(ChipListAlign);
const chipListSelectable = Object.values(ChipListSelectable);

story.add(
  'Chip List',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ChipType.tag),
      align: select('align', alignOptions, ChipListAlign.left),
      removable: boolean('removable', true),
      selectable: boolean('selectable', true),
      focusable: boolean('focusable', true),
      disabled: boolean('disabled', false),
      chipListSelectable: select(
        'chipListSelectable',
        chipListSelectable,
        ChipListSelectable.multi
      ),
      activeIndex: number('activeIndex', 0),
      chips: object('chips', chips),
      onChipRemove: action('Chip removed'),
      onChipClicked: action('Chip clicked'),
      inChipSelected: action('Chip selected'),
      onChipKeydown: action('Chip key pressed'),
    },
    moduleMetadata: {
      imports: [ChipListModule, StoryBookLayoutModule, BrowserAnimationsModule],
    },
  }),
  { notes: { markdown: note } }
);
