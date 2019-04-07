import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { TruncateTooltipModule } from './truncate-tooltip.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template = `
  <p [b-truncate-tooltip]="maxLines">
    If you’re trying to wear official headgear in a public setting, my advice is to take yourself
    as seriously as you expect others to take you. A photographer may not allow you to wear the colander
    if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
    headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
    then they are less likely to make trouble.
  </p>

  <p b-truncate-tooltip>
    We, the Church of the Flying Spaghetti Monster, are not a litigious group
    but of course we, along with the ACLU and others,
    have an interest in defending the individual rights and liberties
    guaranteed by the Constitution and the laws of the United States.
  </p>

  <b-truncate-tooltip>
    I’ve also written a letter below, that you can show any interested parties
    if necessary, that explains that Colanders are indeed a traditional part of
    our belief structure, and a few notes about how this is a legally protected
    right, and so on.
  </b-truncate-tooltip>
`;

const storyTemplate = `
<b-story-book-layout title="Truncate Tooltip Component">

  <div style="padding: 50px; max-width: 600px; margin: auto; text-align: left;">
    ${template}
  </div>

</b-story-book-layout>
`;

const note = `
  ## Truncate Tooltip Component

  #### Module
  *TruncateTooltipModule*


  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  b-truncate-tooltip | number | maximum lines. the overflowing text will be truncated and tooltip with full text will be shown. to disable truncation, set to 0. | 1 (optional)

`;

story.add(
  'Truncate Tooltip Component',
  () => {
    return {
      template: storyTemplate,
      props: {
        maxLines: number('b-truncate-tooltip', 2)
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          TruncateTooltipModule
        ],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
