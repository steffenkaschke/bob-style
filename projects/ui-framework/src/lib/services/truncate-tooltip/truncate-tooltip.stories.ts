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
  <p [bTruncateTooltip]="maxLines" style="padding: 20px;">
    If you’re trying to wear official headgear in a public setting, my advice is to take yourself
    as seriously as you expect others to take you. A photographer may not allow you to wear the colander
    if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
    headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
    then they are less likely to make trouble.
  </p>
`;

const storyTemplate = `
<b-story-book-layout title="Truncate Tooltip Directive">

  <div style="padding: 50px; max-width: 600px; margin: auto; text-align: left;">
    ${template}
  </div>

</b-story-book-layout>
`;

const note = `
  ## Truncate Tooltip Directive

  #### Module
  *TruncateTooltipModule*


  ~~~
  ${template}
  ~~~


`;

story.add(
  'Truncate Tooltip Directive',
  () => {
    return {
      template: storyTemplate,
      props: {
        maxLines: number('maxLines', 2)
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
