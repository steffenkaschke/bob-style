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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChipType } from '../chips.enum';
import { MultiListAndChipsOptionsMock } from './multi-list-and-chips.mock';
import { MultiListAndChipsModule } from './multi-list-and-chips.module';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const options = MultiListAndChipsOptionsMock;

const template = `
  <b-multi-list-and-chips [options]="options"
               >
  </b-multi-list-and-chips>
`;

const note = `
  ## Multi List And Chips
  #### Module
  *MultiListAndChipsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---



  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And Chips'">
  <div style="padding: 30px;margin:auto;max-width:900px;background: rgb(245,245,245);">
    ${template}
  </div>
</b-story-book-layout>
`;

const typeOptions = values(ChipType);

story.add(
  'Multi List And Chips',
  () => ({
    template: storyTemplate,
    props: {
      options: object('options', options)
    },
    moduleMetadata: {
      imports: [
        MultiListAndChipsModule,
        StoryBookLayoutModule,
        BrowserAnimationsModule
      ]
    }
  }),
  { notes: { markdown: note } }
);
