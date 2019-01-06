import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs, number} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import {SliderComponent} from './slider.component';
import {AvatarSize} from '../avatar';

  const sliderStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
  <b-slider [value]="0"  [min]="0" [max]="100" [step]="1">
  </b-slider>
`;
const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  progressChange | EventEmitter | onChange callback |
  value | number | Current slider value | 0 (optional)
  min | number | Minimum value of the slider | 0 (optional)
  max | number | Maximum value of the slider | 100 (optional)
  step | number | Step for each slider change | 1 (optional)

  ~~~
  ${template}
  ~~~
`;

sliderStories.add(
  'Slider',
  () => {
    return {
      template,
      props: {
        value: number('value', 0),
        min: number('min', 0),
        max: number('max', 100),
        step: number('step', 1),
        progressChange: action(),
      },
      moduleMetadata: {
        declarations: [SliderComponent]
      }
    };
  },
  { notes: { markdown: note }  }
);
