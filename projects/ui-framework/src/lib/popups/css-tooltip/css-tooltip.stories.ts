import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  boolean,
  text,
  select
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  CSSTooltipWrap,
  CSSTooltipPosition,
  CSSTooltipShowOn,
  CSSTooltipTextAlign
} from './css-tooltip.enum';

const stories = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
  <p [attr.data-tooltip]="tooltipText"
     [attr.data-tooltip-position]="tooltipPosition"
     [attr.data-tooltip-align]="tooltipTextAlign"
     [attr.data-tooltip-wrap]="tooltipWrap"
     [attr.data-tooltip-show]="tooltipShowOn"
     tabindex="0">
       Hover over this text to see tooltip.
  </p>
`;

const note = `
  ## CSS Tooltip

  #### Module
  *no module* (styles exist in global CSS)

  #### How-to

  By adding \`\`\`data-tooltip="text"\`\`\` atrribute to any element you will get a simple tooltip with text - on hover or on focus (click).


  #### HTML Attributes
  Name | Type | Description | default
  --- | --- | --- | ---
  [attr.data-tooltip] | string | tooltip text | none
  [attr.data-tooltip-position] | CSSTooltipPosition | above or below | 'above'
  [attr.data-tooltip-align] | CSSTooltipTextAlign | text alignment | 'center'
  [attr.data-tooltip-show] | CSSTooltipShowOn | show on hover or on focus (click) - if using on focus, be sure to add tabindex="0" attribute to non-focusable elements | 'hover'
  [attr.data-tooltip-wrap] | CSSTooltipWrap | white-space CSS property - 'normal', 'nowrap' (single line, only use for predictably short tooltips) or 'pre' (will respect line-break symbols \`\`\`\\n\`\`\` in text!) | 'normal'

  ~~~
  ${template}
  ~~~

  #### Notation
  you can use plain HTML attributes, or Angular [attr.xxx] notation (preferred):

  \`\`\`[attr.data-tooltip]="textProperty" \`\`\`

  \`\`\`[attr.data-tooltip]="'Text string'" \`\`\`

  \`\`\`data-tooltip="Some text" \`\`\`

  \`\`\`data-tooltip="{{ textProperty }}" \`\`\`

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
      tooltipPosition: select(
        'tooltipPosition',
        Object.values(CSSTooltipPosition),
        CSSTooltipPosition.above
      ),
      tooltipTextAlign: select(
        'tooltipTextAlign',
        Object.values(CSSTooltipTextAlign),
        CSSTooltipTextAlign.center
      ),
      tooltipWrap: select(
        'tooltipWrap',
        Object.values(CSSTooltipWrap),
        CSSTooltipWrap.normal
      ),
      tooltipShowOn: select(
        'tooltipShowOn',
        Object.values(CSSTooltipShowOn),
        CSSTooltipShowOn.hover
      )
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
