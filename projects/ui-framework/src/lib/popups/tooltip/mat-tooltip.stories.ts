import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  boolean,
  text,
  select,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  CSSTooltipWrap,
  CSSTooltipPosition,
  CSSTooltipShowOn,
  CSSTooltipTextAlign,
} from './tooltip.enum';
import { DividerModule } from '../../layout/divider/divider.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template = `
  <b-heading [matTooltip]="tooltipText"
             [matTooltipClass]="tooltipClass"
             [matTooltipPosition]="tooltipPosition">
       Hover over this text to see tooltip.
  </b-heading>
`;

const note = `
  ## Material Tooltip

  #### Module
  *MatTooltipModule*

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---



  [matTooltip] | string | tooltip text | &nbsp;

  [attr.data-tooltip-position] | CSSTooltipPosition | above or below | 'above'
  [attr.data-tooltip-align] | CSSTooltipTextAlign | text alignment | 'center'
  [attr.data-tooltip-show] | CSSTooltipShowOn | show on hover or on focus (click) - if using on focus, be sure to add tabindex="0" attribute to non-focusable elements | 'hover'
  [attr.data-tooltip-wrap] | CSSTooltipWrap | white-space CSS property - 'normal', 'nowrap' (single line, only use for predictably short tooltips) or 'pre' (will respect line-break symbols \`\`\`\\n\`\`\` in text!) | 'normal'

  ~~~
  ${template}
  ~~~

`;

const storyTemplate = `<b-story-book-layout [title]="'Material Tooltip'">
  <div >

    <div style="text-align:left; max-width: 400px; margin: 0 auto;">
      <p>Material Tooltip should be used in cases when CSS Tooltip does not look good.

      <p><strong>When to use:</strong> For long tooltip text; when inside  <u>overflow: hidden</u> or <u>overflow: auto</u> container; when CSS Tooltip does not look good for whatever reason.</p>

      <p><strong>When not to use:</strong> For short (1-3) words text; If CSS Tooltip looks good, stay with CSS.</u></p>
    </div>

    <b-divider></b-divider>

      ${template}
  </div>
</b-story-book-layout>`;

story.add(
  'Material Tooltip',
  () => ({
    template: storyTemplate,
    props: {
      tooltipText: text(
        'tooltipText',
        'Works best for long text text. \n Automatically positions itself above or below \n depending on available space.'
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
      ),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, DividerModule, TypographyModule],
    },
  }),
  { notes: { markdown: note } }
);
