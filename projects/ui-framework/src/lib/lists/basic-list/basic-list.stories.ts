import { storiesOf } from '@storybook/angular';
import { withKnobs, object } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons } from '../../icons/icons.enum';
import { BasicListModule } from './basic-list.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(withKnobs);

const template = `
  <b-story-book-layout [title]="'Basic List'">
    <b-basic-list [items]="items">
      <b-menu *bBasicListAction="let item=item; let index=index"
              [menu]="menu"
              (actionClick)="action('Action triggered with item, index')(item, index)">
        <b-square-button menu-trigger
                         type="tertiary"
                         icon="b-icon-more-horiz">
        </b-square-button>
      </b-menu>
    </b-basic-list>
  </b-story-book-layout>
`;

const note = `
  ## Basic list

  #### Module
  *BasicListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  items | BasicListItem[] | List of items to display | none

  ~~~
  ${template}
  ~~~
`;

const items = [
  {
    label: 'Item 1',
    icon: Icons.doc,
  },
  {
    label: 'Item 222',
    icon: Icons.doc,
  },
];

const menu = [
  {
    label: 'Menu item 1',
    action: action('Menu item 1 action'),
  },
  {
    label: 'Menu item 2',
    action: action('Menu item 2 action'),
  },
];

story.add(
  'Basic list',
  () => ({
    template,
    props: {
      action,
      items: object('items', items),
      menu: object('menu', menu),
    },
    moduleMetadata: {
      imports: [BasicListModule, MenuModule, StoryBookLayoutModule, ButtonsModule, BrowserAnimationsModule],
    },
  }),
  { notes: { markdown: note } }
);
