import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  boolean,
  text,
  select
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const stories = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
<p [attr.data-tooltip]="tooltipText"
   [attr.data-tooltip-position]="tooltipPosition"
   [attr.data-tooltip-prewrap]="tooltipPrewrap"
   [attr.data-tooltip-onfocus]="tooltipOnFocus"
   tabindex="0">
  Hover over this text to see tooltip.
</p>
`;

const note = `
  ## CSS Tooltip

  #### Module
  *no module* (styles exist in global CSS)

  #### How-to

  By adding \`\`\`data-tooltip="text"\`\`\` atrribute to any element you will get a simple tooiltip with text - on hover.

 #### Notation

  \`\`\`[attr.data-tooltip]="textProperty" \`\`\`

   \`\`\`[attr.data-tooltip]="'Text string'" \`\`\`

  #### Additional attributes

  You may add \`\`\`data-tooltip-position\`\`\` attribute that should equal to 'above' (default) or 'below'.

  If you add \`\`\`data-tooltip-prewrap="true"\`\`\` attribute, the tooltip will respect line-break symbols \`\`\`\\n\`\`\` in text.

  If you add \`\`\`data-tooltip-onfocus="true"\`\`\` attribute, the tooltip will open when you focus (click) the element. And close when element loses focus (user clicked somewhere else). Element must be focusable (add \`\`\`tabindex="0"\`\`\` attribute if needed).


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `<b-story-book-layout [title]="'Info Tooltip'">
  <div style="padding-top: 100px;">
    ${template}
  </div>
</b-story-book-layout>`;

stories.add(
  'CSS Tooltip',
  () => ({
    template: storyTemplate,
    props: {
      tooltipText: text(
        'tooltipText',
        'Lorem ipsum  \ndolor sit amet, \nconsectetur adipiscing elit, \nsed do eiusmod tempor \nincididunt ut'
      ),
      tooltipPosition: select('tooltipPosition', ['above', 'below'], 'above'),
      tooltipPrewrap: boolean('tooltipPrewrap', false),
      tooltipOnFocus: boolean('tooltipOnFocus', false)
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
