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
import { ComponentGroupType } from '../../../consts';
import { CardsModule } from '../cards.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-cards>
  <p card-top>Kyle Wilson</p>
  <p card-bottom>No approvers are required</p>
</b-cards>
`;

const storyTemplate = `
<b-story-book-layout title="'Cards Layout'">
  <div style="display: flex; width:280px; height: 280px; margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Cards Layout

  #### Module
  *CardsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  menu | MenuItem[] | array of menu items | none (optional)
  text | string | main text | ''

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Cards Layout',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule]
      }
    };
  },
  { notes: { markdown: note } }
);
