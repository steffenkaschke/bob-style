import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ActionBarModule } from './action-bar.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

const inputStories = storiesOf(
  ComponentGroupType.Navigation,
  module
).addDecorator(withKnobs);

const componentTemplate = `
<b-single-list-navigation [label]="label">
    <b-button>Test</b-button>
</b-single-list-navigation>
`;

const template = `
<b-story-book-layout [title]="'action bar'">
  <div style="max-width: 400px;">
  ${ componentTemplate }
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list navigation

  #### Module
  *SingleListNavigationModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  label | string | The label that on the left side.

  ~~~
  ${ componentTemplate }
  ~~~
`;

inputStories.add(
  'Action Bar',
  () => {
    return {
      template,
      props: {
        label: text('label', 'Test label')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          ActionBarModule,
          StoryBookLayoutModule,
          ButtonsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
