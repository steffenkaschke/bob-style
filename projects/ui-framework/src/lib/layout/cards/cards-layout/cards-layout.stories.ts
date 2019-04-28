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
import { values } from 'lodash';
import { ComponentGroupType } from '../../../consts';
import { CardsModule } from '../cards.module';

import { CardsMockData } from '../cardsMockData';
import { CardType } from '../cards.enum';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { AvatarComponent } from '../../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../../buttons-indicators/slider/slider.module';
import { SliderComponent } from '../../../buttons-indicators/slider/slider.component';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-cards
    [type]="type"
    [cards]="cardsData"
    [addCard]="addCard"
    (cardClicked)="cardClickHandler($event)">
</b-cards>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Cards Layout'">
  <div style="padding: 30px;">
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

const AddCardMockData = {
  title: 'Add a new flow',
  subtitle: 'Right now',
  action: action('Add Card was clicked')
};

story.add(
  'Cards Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.primary),
        addCard: object('addCard', AddCardMockData),
        cardsData: object('cardsData', CardsMockData),
        cardClickHandler: action('Card clicked')
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardsModule,
          AvatarModule,
          SliderModule
        ],
        entryComponents: [AvatarComponent, SliderComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
