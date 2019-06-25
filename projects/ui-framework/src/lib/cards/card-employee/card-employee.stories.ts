import { storiesOf } from '@storybook/angular';
import { object, select, withKnobs } from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { CardsMockData } from '../cardsMockData';
import { CardType } from '../cards.enum';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const card = {
  data: {
    employee: {
      imageSource:
        'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg',
      title: 'John Doe',
      subtitle: 'Web Developer'
    }
  }
};

const template = `
<b-card-employee [card]="cardData"
        [type]="type">
</b-card-employee>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employee Card'">
  <div style="display: flex; width:280px; margin: 50px auto; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | primary (optional)
  card | CardData | card contents data | none

  #### card: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | CardDataType | card data | none
  menu | MenuItem[] | array of menu items | none (optional)

  *Note:* For desctiption of [data: CardDataType] properties, see <u>Cards Layout</u> story.

`;

story.add(
  'EmployeeCard',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.primary),
        cardData: object('card', card)
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
