import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import {
  boolean,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SideMenuModule } from './side-menu.module';
import { IconComponent } from '../../icons/icon.component';
import { IconsModule } from '../../icons/icons.module';
import { getSideMenuOptionsMock } from './side-menu.mock';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import { ButtonsModule } from 'bob-style';

const inputStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-side-menu [options]="options"
             [headerLabel]="headerLabel"
             (selectOption)="selectOption($event)">
  <b-square-button icon="b-icon-file-download" type="tertiary"></b-square-button>
</b-side-menu>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Side Menu'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Side Menu

  #### Module
  *SideMenuModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  headerLabel | string | header of menu 
  options | SideMenuOption[] | array of options
  onSelectOption | Action | select option emitter

  ~~~
  ${template}
  ~~~
`;

const sideMenuOptionsMock = getSideMenuOptionsMock;

inputStories.add(
  'Side Menu',
  () => {
    return {
      template: storyTemplate,
      props: {
        headerLabel: text('headerLabel', 'test menu'),
        options: object<SideMenuOption[]>('options', sideMenuOptionsMock),
        selectOption: action('Side menu select')
      },
      moduleMetadata: {
        entryComponents: [IconComponent],
        imports: [
          BrowserAnimationsModule,
          SideMenuModule,
          StoryBookLayoutModule,
          IconsModule,
          ButtonsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
