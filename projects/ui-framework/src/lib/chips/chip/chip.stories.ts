import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ChipModule } from './chip.module';
import { ChipType } from '../chips.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const typeOptions = values(ChipType);
const template = `
  <b-chip
    [type]="type"
    [disabled]="disabled"
    (removed)="onRemove()">
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
  *ChipModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | chip text | ''
  type | ChipType | enum for setting the chip type (empty, default, info, success, attention, warning) | default (optional)
  removable | boolean | if chip has a 'x' button | false
  removed | Function | handler for chip-removed event | none

  ~~~
  ${template}
  ${template2}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip'">
  <div style="margin: 50px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Chip',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ChipType.tag),
      text: text('text', 'Chip text'),
      disabled: boolean('disabled', false),
      onRemove: action('Chip removed')
    },
    moduleMetadata: {
      imports: [ChipModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
