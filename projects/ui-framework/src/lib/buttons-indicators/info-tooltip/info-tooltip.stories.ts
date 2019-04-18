import { storiesOf } from '@storybook/angular';
import { withKnobs, object } from '@storybook/addon-knobs/angular';
import { InfoTooltipModule } from './info-tooltip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const stories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(
  withKnobs
);

const template = `<b-info-tooltip
[tooltipPanel]="tooltipPanel"></b-info-tooltip>`;

const note = `
  ## Switch toggle element
  #### Module
  *InfoTooltipModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  tooltipPanel | json | tooltip configuration - title, text, link
  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `<b-story-book-layout title="Info Tooltip">
  ${template}
</b-story-book-layout>`;

stories.add(
  'Info tooltip',
  () => ({
    template: storyTemplate,
    props: {
      tooltipPanel: object('tooltipPanel', {
        title: 'Panel title',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
        link: { text: 'Click here', url: 'https://app.hibob.com' }}),
    },
    moduleMetadata: {
      imports: [InfoTooltipModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
