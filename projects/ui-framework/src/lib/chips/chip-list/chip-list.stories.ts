import { storiesOf } from '@storybook/angular';
import { object, withKnobs, select, boolean, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { simpleUID, randomNumber, randomFromArray } from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { ChipType, ChipListAlign, ChipListSelectable } from '../chips.enum';
import { mockAvatar, mockNames } from '../../mock.const';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(withKnobs);

const icons = randomFromArray(
  [
    Icons.calendar,
    Icons.chat,
    Icons.doc_add,
    Icons.doc_icon,
    Icons.email,
    Icons.harmonise,
    Icons.home_main,
    Icons.home,
    Icons.infinite,
    Icons.lock,
    Icons.megaphone,
    Icons.note,
    Icons.department_icon,
    Icons.person,
    Icons.person_check,
    Icons.print,
    Icons.success,
    Icons.tag
  ],
  null
);

const chips = mockNames(10).map((chip, index) => ({
  text: chip,
  id: simpleUID(),
  imageSource: mockAvatar(),
  selected: randomNumber() > 90,
  disabled: randomNumber() > 90,
  icon: icons[index]
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

const note = `
  ## Chip List

  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [chips] | Chip[] / string[] | Array of Chip objects (will also accept an array of strings) | &nbsp;
  [chipListSelectable] | chipListSelectable (single, multi) | single select (like radio buttons) or multi select | multi
  [activeIndex] | number | active index initializer | &nbsp;
  [config] | ChipListConfig | list configuration (options common to all \
    chips, including: type, removable, selectable, focusable, disabled, align) | &nbsp;
  (removed) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip removed event | &nbsp;
  (clicked) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip clicked event | &nbsp;
  (selected) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip selected event (fired only if chip is selectable) | &nbsp;
  (keyPressed) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip KeyDown event | &nbsp;

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
      chipListSelectable: select('chipListSelectable', chipListSelectable, ChipListSelectable.multi),
      activeIndex: number('activeIndex', 0),
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
