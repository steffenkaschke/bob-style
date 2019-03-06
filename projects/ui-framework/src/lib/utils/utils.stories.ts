import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';

const utilsStories = storiesOf('Utils', module);

const storyTemplate = `
<b-story-book-layout title="Utils">

</b-story-book-layout>
`;

const note = `
  ## Utils Service
  #### Module
  *UtilsModule*
  #### Methods

  ##### getResizeEvent
  Returns observable of window resize events

`;

utilsStories.add(
  'UtilsService',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
