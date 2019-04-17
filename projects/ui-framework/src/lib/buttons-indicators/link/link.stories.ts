import { storiesOf } from '@storybook/angular';
import { object, withKnobs, select, boolean } from '@storybook/addon-knobs/angular';
import { LinkModule } from './link.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor } from './link.enum';
import { values } from 'lodash';
const color = values(LinkColor);

const linkStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(
  withKnobs
);
const template = `<b-link
  [config]="config"
  [openInNewWindow]="openInNewWindow"
  [color]="color">
</b-link>`;

const storyTemplate = `<b-story-book-layout title="Link">
  ${template}
</b-story-book-layout>`;

const note = `
  ## Slider Element
  #### Module
  *SliderModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  config | object | link configuration - text, url |
  openInNewWindow | boolean | open link in new window or not  | false (optional)
  color | string | define link color | none (optional)
  ~~~
  ${template}
  ~~~
`;

linkStories.add(
  'Link',
  () => {
    return {
      template: storyTemplate,
      props: {
        config: object('config', { text: 'Learn more', url: 'https://app.hibob.com' }),
        openInNewWindow: boolean('openInNewWindow', true),
        color: select('color', color, LinkColor.none),
      },
      moduleMetadata: {
        imports: [LinkModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
