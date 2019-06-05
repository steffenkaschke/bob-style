import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BarModule } from './bar.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

const inputStories = storiesOf(ComponentGroupType.Navigation, module).addDecorator(withKnobs);

const componentTemplate = `
<b-bar [label]="label">
    <b-button>Test</b-button>
</b-bar>
`;

const template = `
<b-story-book-layout [title]="'bar'">
  ${componentTemplate}
</b-story-book-layout>
`;

const note = `
  ## Bar Element

  #### Module
  *BarModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  label | string | The label that on the left side.

  ~~~
  ${componentTemplate}
  ~~~
`;

inputStories.add(
  'Bar',
  () => {
    return {
      template,
      props: {
        label: text('label', 'Test label'),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, BarModule, StoryBookLayoutModule, ButtonsModule]
      }
    };
  },
  { notes: { markdown: note } }
);
