import { storiesOf } from '@storybook/angular';
import { object, withKnobs, text } from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChipType } from '../chips.enum';
import { MultiListAndChipsOptionsMock } from './multi-list-and-chips.mock';
import { MultiListAndChipsModule } from './multi-list-and-chips.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const options = MultiListAndChipsOptionsMock;

const template = `
  <b-multi-list-and-chips
        [options]="options"
        [listLabel]="listLabel"
        [chipsLabel]="chipsLabel"
        (selectChange)="onSelectChange($event)">
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
      listLabel: text('chipsLabel', 'Select fields:'),
      chipsLabel: text('listLabel', 'Selected fields:'),
      options: object('options', options),
      onSelectChange: action('ListChange')
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
