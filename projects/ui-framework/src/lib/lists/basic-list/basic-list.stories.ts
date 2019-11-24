import { storiesOf } from '@storybook/angular';
import { withKnobs, object } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons, IconColor } from '../../icons/icons.enum';
import { BasicListModule } from './basic-list.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicListItem } from './basic-list.interface';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const withMenuTemplate = `
  <b-basic-list [items]="items">
    <b-menu *bBasicListAction="let item=item" [menu]="item.menu">
      <b-square-button menu-trigger
                       type="tertiary"
                       icon="b-icon-more-horiz"
                       [color]="iconColor.normal">
      </b-square-button>
    </b-menu>
  </b-basic-list>
`;

const withButtonTemplate = `
  <b-basic-list [items]="items">
    <b-button *bBasicListAction="let item=item"
              type="secondary"
              size="small"
              (clicked)="action('List item button clicked with item')(item)">
      Click me
    </b-button>
  </b-basic-list>
`;

const storyTemplate = `
  <b-story-book-layout [title]="'Basic List'">
    <div style="max-width: 400px;">
      ${withMenuTemplate}
      &nbsp;&nbsp;
      ${withButtonTemplate}
    </div>
  </b-story-book-layout>
`;

const note = `
  ## Basic list

  #### Module
  *BasicListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  items | BasicListItem[] | List of items to display | &nbsp;

  ~~~
  ${withMenuTemplate}
  ~~~

  ~~~
  ${withButtonTemplate}
  ~~~
`;

const items: BasicListItem[] = [{
  label: 'Item 1',
  icon: Icons.doc,
  menu: [{
    label: 'Menu item 1',
    action: action(`List item Item 1,  Menu action 1`),
  }, {
    label: 'Menu item 2',
    action: action(`List item Item 1,  Menu action 2`),
  }],
}, {
  label: 'Item 2',
  icon: Icons.doc,
  menu: [{
    label: 'Menu item 1',
    action: action(`List item Item 2,  Menu action 1`),
  }, {
    label: 'Menu item 2',
    action: action(`List item Item 2,  Menu action 2`),
  }],
}];

story.add(
  'Basic list',
  () => ({
    template: storyTemplate,
    props: {
      action,
      items: object('items', items),
      iconColor: IconColor,
    },
    moduleMetadata: {
      imports: [
        BasicListModule,
        MenuModule,
        StoryBookLayoutModule,
        ButtonsModule,
        BrowserAnimationsModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
