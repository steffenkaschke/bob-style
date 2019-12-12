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
import {
  simpleUID,
  randomNumber,
  randomFromArray,
} from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { ChipType, ChipListAlign, ChipListSelectable } from '../chips.enum';
import { mockAvatar, mockNames } from '../../mock.const';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

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
    Icons.tag,
  ],
  null
);

const chips = mockNames(10).map((chip, index) => ({
  text: chip,
  id: simpleUID(),
  imageSource: mockAvatar(),
  selected: randomNumber() > 90,
  disabled: randomNumber() > 90,
  icon: icons[index],
}));
chips[2].selected = true;

const template = `
  <b-chip-list [chips]="chips"
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
  Name | Type | Description
  --- | --- | ---
  [chips] | Chip[] / string[] | Array of Chip objects (will also accept an array of strings)
  **[config]** | ChipListConfig | list configuration (options common to all \
    chips, including: type, removable, selectable, focusable, disabled, align)
  [activeIndex] | number | index of selected chip (can be used to select chip in single-selectable mode)
  (removed) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip removed event
  (clicked) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip clicked event
  (selected) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip selected event (fired only if chip is selectable)
  (keyPressed) | EventEmitter<wbr>&lt;{chip: Chip, event: KeyboardEvent}&gt; | emited on chip KeyDown event

  ~~~
  ${template}
  ~~~


  #### interface ChipListConfig
  Name | Type | Description
  --- | --- | ---
  type | ChipType | chip type (tag, tab, avatar, icon, info, warning, error, success) | tag
  removable | boolean | if chip has remove (x) button | false
  selectable | boolean / ChipListSelectable | single (only 1 chip \
     selected at a time), multi (multiple chips can be selected). setting to true equals <u>multi</u> | false
  focusable | boolean | if true, focused chip will be indicated via a \
   slightly darker background color (usefull for keyboard navigation) | false
  disabled | boolean | disables chip list | false
  align | ChipListAlign | controls chip alignment (left, right, center, justify) | left

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
      focusable: boolean('focusable', true),
      disabled: boolean('disabled', false),
      selectable: select(
        'selectable',
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
