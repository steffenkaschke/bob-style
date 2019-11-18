import { storiesOf } from '@storybook/angular';
import { withKnobs, object } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { Icons } from '../../../icons/icons.enum';
import { BasicListModule } from './basic-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
  <b-story-book-layout [title]="'Basic List'">
    <b-basic-list [items]="items" [menu]="menu"></b-basic-list>
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
  menu | MenuItem[] | Optional menu for each list item | undefined

  ~~~
  ${template}
  ~~~
`;

const items = [{
  label: 'Item 1',
  icon: Icons.doc,
}, {
  label: 'Item 2',
  icon: Icons.doc,
}];

const menu = [{
  label: 'Menu item 1',
  action: action('Menu item 1 action'),
}, {
  label: 'Menu item 2',
  action: action('Menu item 2 action'),
}];

story.add(
  'Basic list',
  () => ({
    template,
    props: {
      items: object('items', items),
      menu: object('menu', menu),
    },
    moduleMetadata: {
      imports: [
        BasicListModule,
        StoryBookLayoutModule
      ],
    },
  }),
  { notes: { markdown: note } }
);
