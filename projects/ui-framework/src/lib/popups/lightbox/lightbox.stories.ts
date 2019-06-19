import { storiesOf } from '@storybook/angular';
import {
  select,
  text,
  withKnobs,
  boolean
} from '@storybook/addon-knobs/angular';
import { LightboxModule } from './lightbox.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LightboxExampleModule } from './lightbox-example.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

const lightboxStories = storiesOf(
  ComponentGroupType.Popups,
  module
).addDecorator(withKnobs);

const template = `<b-lightbox-example
                  [imageLink]="imageLink"
                  [videoLink]="videoLink"
                  [showInLightbox]="showInLightbox"
                  [fillScreen]="fillScreen">
                </b-lightbox-example>`;

const storyTemplate = `<b-story-book-layout [title]="'Lightbox'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## LightboxService

  #### Module
  *LightboxModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  config | LightboxConfig | config object with properties:
  config.component | RenderedComponent | component to be rendered in lightbox | none
  config.image | string | valid image URL to show in lightbox | none
  config.video | string | embedable youtube or vimeo link to show in lightbox (other URLs will throw error) | none
  config.fillScreen | boolean | if content should fill most of the screen (may be important for components) | none


  #### Example call

  \`\`\`
    this.lightboxService.showLightbox({
      video: 'https://www.youtube.com/embed/p3j2NYZ8FKs
    })
  \`\`\`

  \`\`\`
    this.lightboxService.showLightbox({
      component: {
        component: AvatarComponent,
        attributes: {
          title: 'John Malkovich',
          subtitle: 'American actor',
          orientation: 'vertical',
          imageSource: 'https://randomuser.me/api/portraits/men/1.jpg,
          size: AvatarSize.large
        }
      },
      fillScreen: true
    })
  \`\`\`

`;

lightboxStories.add(
  'Lightbox',
  () => {
    return {
      template: storyTemplate,
      props: {
        showInLightbox: select(
          'showInLightbox',
          ['image', 'video', 'component'],
          'image'
        ),
        imageLink: text(
          'imageLink',
          'https://ksassets.timeincuk.net/wp/uploads/sites/55/2018/03/GettyImages-74308096-920x584.jpg'
        ),
        videoLink: text(
          'videoLink',
          'https://www.youtube.com/embed/p3j2NYZ8FKs'
        ),
        fillScreen: boolean('fillScreen', false)
      },
      moduleMetadata: {
        imports: [
          LightboxModule,
          LightboxExampleModule,
          StoryBookLayoutModule,
          ButtonsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
