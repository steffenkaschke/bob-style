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
import { TypographyModule } from '../../typography/typography.module';
import { TruncateTooltipModule } from './truncate-tooltip.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template1 = `
  <b-big-body *bTruncateTooltip="maxLines">
    <span>
        If you’re trying to wear official headgear in a public setting, my advice is to take yourself
        as seriously as you expect others to take you. A photographer may not allow you to wear the colander
        if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
        headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
        then they are less likely to make trouble.
    </span>
    <span>THIS TEXT TOO!</span>
  </b-big-body>
`;
const template2 = `
  <b-truncate-tooltip [maxLines]="maxLines">
    <b-display-3>
      <span>
          If you’re trying to wear official headgear in a public setting, my advice is to take yourself
          as seriously as you expect others to take you. A photographer may not allow you to wear the colander
          if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
          headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
          then they are less likely to make trouble.
      </span>
      <span>THIS TEXT TOO!</span>
    </b-display-3>
  </b-truncate-tooltip>
`;

const storyTemplate = `
<b-story-book-layout title="'Truncate Tooltip'">
  <div style="padding: 100px 50px 50px; max-width: 600px; margin: auto; text-align: left;">
    <p>${template1}</p>
    <br>
    <p>${template2}</p>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Truncate Tooltip

  #### Module
  *TruncateTooltipModule*


  #### Use as a (structural) directive (*bTruncateTooltip):
  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  bTruncateTooltip | number | maximum lines. the overflowing text will be truncated and tooltip with full text will be shown. to disable truncation, set to 0 or null. | 1 (optional)


  #### Use as a component (b-truncate-tooltip):
  ~~~
  ${template2}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  maxLines | number | maximum lines. the overflowing text will be truncated and tooltip with full text will be shown. to disable truncation, set to 0 or null. | 1 (optional)


`;

story.add(
  'Truncate Tooltip',
  () => {
    return {
      template: storyTemplate,
      props: {
        maxLines: number('bTruncateTooltip/maxLines', 2)
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          TypographyModule,
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
