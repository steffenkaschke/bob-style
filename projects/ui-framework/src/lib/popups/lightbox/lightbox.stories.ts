import { storiesOf } from '@storybook/angular';
import { select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { LightboxModule } from './lightbox.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { LightboxExampleModule } from './lightbox-example.module';

const lightboxStories = storiesOf(
  ComponentGroupType.Popups,
  module
).addDecorator(withKnobs);

const template = `<b-lightbox-example></b-lightbox-example>`;

const storyTemplate = `<b-story-book-layout [title]="'Lightbox'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## Lightbox Element
  #### Module
  *LightboxModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  lightboxSize | LightboxSize | sizes - small, medium, large
  lightboxType | LightboxType | types - success, error, information, warning
  text | string | The text inside the lightbox
  ~~~
`;

lightboxStories.add(
  'Lightbox',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [LightboxModule, LightboxExampleModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
