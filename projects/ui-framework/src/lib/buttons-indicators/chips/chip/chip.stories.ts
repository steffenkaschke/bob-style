import { storiesOf, moduleMetadata } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ChipsModule } from '../chips.module';
import { ChipType } from '../chips.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const typeOptions = values(ChipType);
const template = `
  <b-chip
    [type]="type"
    [color]="color"
    [removable]="removable"
    (removed)="OnRemove()">
    {{ text }}
  </b-chip>
`;
const template2 = `
  <p b-chip [type]="type">
    Used as directive
  </p>
`;

const note = `
  ## Chip
  #### Module
  *ChipsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | chip text | ''
  type | ChipType | enum for setting the chip type (empty, default, info, success, attention, warning) | default (optional)
  color | string | custom chip color | '' (optional)
  removable | boolean | if chip has a 'x' button | false
  removed | Function | handler for chip-removed event | none

  ~~~
  ${template}
  ${template2}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip'">
  <div style="margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Chip',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ChipType.default),
      text: text('text', 'Chip text'),
      color: text('color', ''),
      removable: boolean('removable', false),
      OnClick: action('Chip clicked'),
      OnRemove: action('Chip removed')
    },
    moduleMetadata: {
      imports: [ChipsModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
